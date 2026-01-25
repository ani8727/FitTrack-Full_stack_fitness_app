package com.fitness.activityservice.config;

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
@EnableConfigurationProperties(RabbitMqConfig.RabbitMQProperties.class)
public class RabbitMqConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMqConfig.class);

    private final RabbitMQProperties rabbitMQProperties;

    public RabbitMqConfig(RabbitMQProperties rabbitMQProperties) {
        this.rabbitMQProperties = rabbitMQProperties;
        log.info("RabbitMQ Host: {}", rabbitMQProperties.getAddresses());
        log.info("RabbitMQ Queue: {}", rabbitMQProperties.getQueue());
        log.info("RabbitMQ Exchange: {}", rabbitMQProperties.getExchange());
    }

    @Bean
    public Queue activityQueue() {
        return new Queue(rabbitMQProperties.getQueue(), true);
    }

    @Bean
    public DirectExchange activityExchange() {
        return new DirectExchange(rabbitMQProperties.getExchange());
    }

    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) {
        return BindingBuilder.bind(activityQueue).to(activityExchange).with(rabbitMQProperties.getRoutingKey());
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @ConfigurationProperties(prefix = "rabbitmq.custom")
    public static class RabbitMQProperties {
        /**
         * These are NOT standard spring.rabbitmq.* properties, but are for queue/exchange/routingKey only.
         * The actual connection is handled by Spring Boot's spring.rabbitmq.* properties.
         */
        private String queue = "activity.queue";
        private String exchange = "activity.exchange";
        private String routingKey = "activity.tracking";
        private String addresses = "${spring.rabbitmq.addresses:localhost}";

        public String getQueue() { return queue; }
        public void setQueue(String queue) { this.queue = queue; }

        public String getExchange() { return exchange; }
        public void setExchange(String exchange) { this.exchange = exchange; }

        public String getRoutingKey() { return routingKey; }
        public void setRoutingKey(String routingKey) { this.routingKey = routingKey; }

        public String getAddresses() { return addresses; }
        public void setAddresses(String addresses) { this.addresses = addresses; }
    }
}
