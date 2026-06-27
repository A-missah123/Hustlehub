package com.hustlehub.hustlehub.controller;
import com.hustlehub.hustlehub.model.Bid;
import com.hustlehub.hustlehub.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BidController {
    private final BidService bidService;
    @PostMapping
    public ResponseEntity<?> placeBid(@RequestBody Map<String, Object> body) {
        try {
            Long taskId = Long.valueOf(body.get("taskId").toString());
            Long taskerId = Long.valueOf(body.get("taskerId").toString());
            Double amount = Double.valueOf(body.get("amount").toString());
            String note = body.get("note") != null ? body.get("note").toString() : "";
            return ResponseEntity.ok(bidService.placeBid(taskId, taskerId, amount, note));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/task/{taskId}")
    public List<Bid> getBidsByTask(@PathVariable Long taskId) {
        return bidService.getBidsByTask(taskId);
    }
}