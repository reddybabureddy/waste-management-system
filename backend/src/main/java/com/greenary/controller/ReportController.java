package com.greenary.controller;

import com.greenary.model.Report;
import com.greenary.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*") // In production, restrict this to your frontend URL
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @GetMapping
    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByDateDesc();
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createReport(@RequestBody Report report) {
        reportRepository.save(report);
        Map<String, String> response = new HashMap<>();
        response.put("message", "success");
        response.put("id", report.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReport(@PathVariable String id, @RequestBody Report updateData) {
        Optional<Report> existingReportOpt = reportRepository.findById(id);
        
        if (existingReportOpt.isPresent()) {
            Report report = existingReportOpt.get();
            
            if (updateData.getStatus() != null) {
                report.setStatus(updateData.getStatus());
            }
            if (updateData.getRating() != null) {
                report.setRating(updateData.getRating());
            }
            
            reportRepository.save(report);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "success");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Report not found");
        }
    }
}
