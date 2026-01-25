
package com.fitness.aiservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class RabbitMqConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMqConfig.class);

    @Value("${activity.rabbitmq.exchange}")
    private String exchangeName;

    @Value("${activity.rabbitmq.queue}")
    private String queueName;

    @Value("${activity.rabbitmq.routing-key}")
    private String routingKey;

    @Bean
    public DirectExchange activityExchange() {
        log.info("RabbitMQ Exchange: {}", exchangeName);
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public Queue activityQueue() {
        log.info("RabbitMQ Queue: {}", queueName);
        return new Queue(queueName, true);
    }

    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) {
        log.info("RabbitMQ Routing Key: {}", routingKey);
        return BindingBuilder.bind(activityQueue)
                .to(activityExchange)
                .with(routingKey);
    }
}
