package com.smarttaskmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Forwards known frontend routes to index.html so direct browser refresh/open works.
 */
@Controller
public class SpaController {

    @GetMapping({"/login", "/register", "/dashboard", "/projects", "/tasks", "/analytics", "/settings"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
