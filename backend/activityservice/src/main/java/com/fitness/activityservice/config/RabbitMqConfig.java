
package com.fitness.activityservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class RabbitMqConfig {

    private static final Logger log = LoggerFactory.getLogger(RabbitMqConfig.class);
    private final Environment env;

    public RabbitMqConfig(Environment env) {
        this.env = env;
    }

    @Bean
    public DirectExchange activityExchange() {
        String exchange = env.getProperty("RABBITMQ_EXCHANGE_NAME", "activity.exchange");
        log.info("RabbitMQ Exchange: {}", exchange);
        return new DirectExchange(exchange, true, false);
    }

    @Bean
    public Queue activityQueue() {
        return new Queue("activity.queue", true);
    }

    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) {
        return BindingBuilder.bind(activityQueue)
                .to(activityExchange)
                .with("activity.created");
    }
}