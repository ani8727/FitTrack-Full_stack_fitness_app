package com.fitness.adminservice.client;

import java.util.List;

import com.fitness.adminservice.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service-client", url = "${USER_SERVICE_URL}")
public interface UserServiceClient {

    @GetMapping("/users")
    List<UserDTO> listUsers();

    @GetMapping("/users/{id}")
    UserDTO getUser(@PathVariable("id") Long id);

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable("id") Long id);

    // Optional: ban endpoint; some user services use this pattern
    @GetMapping("/users/search")
    List<UserDTO> search(@RequestParam("q") String q);
}
