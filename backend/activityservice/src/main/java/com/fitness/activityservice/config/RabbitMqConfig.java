package com.fitness.activityservice.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class RabbitMqConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMqConfig.class);

    @Value("${spring.rabbitmq.host}")
    private String rabbitHost;

    @Value("${spring.rabbitmq.port}")
    private int rabbitPort;

    @Value("${spring.rabbitmq.virtual-host}")
    private String rabbitVHost;

    @Value("${spring.rabbitmq.ssl.enabled}")
    private boolean rabbitSslEnabled;

    @Value("${rabbitmq.custom.queue:activity.queue}")
    private String queue;

    @Value("${rabbitmq.custom.exchange:activity.exchange}")
    private String exchange;

    @Value("${rabbitmq.custom.routingKey:activity.tracking}")
    private String routingKey;

    public RabbitMqConfig() {
        // No-args constructor
    }

    @Bean
    public void logRabbitConfig() {
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

    // All legacy RabbitMQProperties and addresses removed. Only standard properties and @Value injection used.
}
