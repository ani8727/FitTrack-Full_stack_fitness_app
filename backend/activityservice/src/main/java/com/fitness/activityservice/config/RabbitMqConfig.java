package com.fitness.activityservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.util.StringUtils;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class RabbitMqConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMqConfig.class);

    @Value("${spring.rabbitmq.addresses:}")
    private String rabbitAddresses;

    @Value("${spring.rabbitmq.host:}")
    private String rabbitHost;

    @Value("${spring.rabbitmq.port:5672}")
    private int rabbitPort;

    @Value("${spring.rabbitmq.virtual-host:/}")
    private String rabbitVHost;

    @Value("${spring.rabbitmq.username:}")
    private String rabbitUsername;

    @Value("${spring.rabbitmq.password:}")
    private String rabbitPassword;

    @Value("${spring.rabbitmq.ssl.enabled:false}")
    private boolean rabbitSslEnabled;

    @Value("${rabbitmq.custom.queue:activity.queue}")
    private String queue;

    @Value("${rabbitmq.custom.exchange:activity.exchange}")
    private String exchange;

    @Value("${rabbitmq.custom.routingKey:activity.tracking}")
    private String routingKey;

    public RabbitMqConfig() {}

    @PostConstruct
    public void logRabbitConfig() {
        log.info("RabbitMQ Addresses: {}", rabbitAddresses);
        log.info("RabbitMQ Host: {}", rabbitHost);
        log.info("RabbitMQ Port: {}", rabbitPort);
        log.info("RabbitMQ VHost: {}", rabbitVHost);
        log.info("RabbitMQ SSL: {}", rabbitSslEnabled);
    }

    @Bean
    public Queue activityQueue() {
        return new Queue(queue, true);
    }

    @Bean
    public DirectExchange activityExchange() {
        return new DirectExchange(exchange);
    }

    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) {
        return BindingBuilder.bind(activityQueue).to(activityExchange).with(routingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public CachingConnectionFactory connectionFactory() {
        // Validate required config
        if (!StringUtils.hasText(rabbitUsername) || !StringUtils.hasText(rabbitPassword)) {
            throw new IllegalStateException("RabbitMQ username and password must be set via environment variables");
        }
        String addresses = StringUtils.hasText(rabbitAddresses) ? rabbitAddresses : rabbitHost + ":" + rabbitPort;
        CachingConnectionFactory factory = new CachingConnectionFactory();
        factory.setAddresses(addresses != null ? addresses : "localhost:5672");
        factory.setUsername(rabbitUsername != null ? rabbitUsername : "guest");
        factory.setPassword(rabbitPassword != null ? rabbitPassword : "guest");
        factory.setVirtualHost(rabbitVHost != null ? rabbitVHost : "/");
        // Enable SSL if amqps or ssl enabled
        if (rabbitSslEnabled || (addresses != null && addresses.startsWith("amqps://"))) {
            try {
                factory.getRabbitConnectionFactory().useSslProtocol();
                log.info("RabbitMQ SSL enabled");
            } catch (Exception sslEx) {
                log.error("Failed to enable SSL for RabbitMQ", sslEx);
            }
        }
        // Fail gracefully if not reachable
        try {
            factory.createConnection().close();
        } catch (Exception connEx) {
            log.error("RabbitMQ is not reachable at startup: {}", connEx.getMessage());
        }
        return factory;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(CachingConnectionFactory connectionFactory, MessageConverter messageConverter) {
        if (connectionFactory == null) throw new IllegalArgumentException("ConnectionFactory must not be null");
        if (messageConverter == null) throw new IllegalArgumentException("MessageConverter must not be null");
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}