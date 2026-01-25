package com.fitness.aiservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
// No legacy RabbitMQProperties, use @Value for custom queue/exchange/routingKey
public class RabbitMqConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMqConfig.class);

    @org.springframework.beans.factory.annotation.Value("${spring.rabbitmq.host}")
    private String rabbitHost;

    @org.springframework.beans.factory.annotation.Value("${spring.rabbitmq.port}")
    private String rabbitPort;

    @org.springframework.beans.factory.annotation.Value("${spring.rabbitmq.virtual-host}")
    private String rabbitVhost;

    @org.springframework.beans.factory.annotation.Value("${spring.rabbitmq.ssl.enabled:false}")
    private boolean rabbitSslEnabled;

    @org.springframework.beans.factory.annotation.Value("${rabbitmq.custom.queue:activity.queue}")
    private String queue;

    @org.springframework.beans.factory.annotation.Value("${rabbitmq.custom.exchange:activity.exchange}")
    private String exchange;

    @org.springframework.beans.factory.annotation.Value("${rabbitmq.custom.routingKey:activity.tracking}")
    private String routingKey;

    public RabbitMqConfig() {
        log.info("RabbitMQ Host: {}", rabbitHost);
        log.info("RabbitMQ Port: {}", rabbitPort);
        log.info("RabbitMQ VHost: {}", rabbitVhost);
        log.info("RabbitMQ SSL Enabled: {}", rabbitSslEnabled);
        log.info("RabbitMQ Queue: {}", queue);
        log.info("RabbitMQ Exchange: {}", exchange);
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

    // All legacy RabbitMQProperties and addresses removed. Only standard properties and @Value injection used.
}
