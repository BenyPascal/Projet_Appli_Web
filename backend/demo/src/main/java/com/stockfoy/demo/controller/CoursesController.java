package com.stockfoy.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockfoy.demo.entity.Courses;
import com.stockfoy.demo.services.CoursesService;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/courses")
public class CoursesController {
    private final CoursesService service;

    public CoursesController(CoursesService service) {
        this.service = service;
    }

    @GetMapping
    public List<Courses> getAllCourses() {
        return service.getAllCourses();
    }
    
    @PostMapping("/generer")
    public List<Courses> genererListeCourse() {
        return service.genererListeCourses();
    }
}