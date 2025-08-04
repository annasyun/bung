package com.bung.controller;

import com.bung.model.Bung;
import com.bung.service.BungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bung")
public class BungController {
    private final BungService bungService;

    @Autowired
    public BungController(BungService bungService) {
        this.bungService = bungService;
    }

    // Create: POST /bung
    @PostMapping
    public ResponseEntity<Bung> createBung(@RequestBody Bung bung) {
        Bung createdBung = bungService.createBung(bung);
        return new ResponseEntity<>(createdBung, HttpStatus.CREATED);
    }

    // Read: GET /bungs
    @GetMapping
    public ResponseEntity<List<Bung>> getAllBungs() {
        List<Bung> bungs = bungService.getAllBungs();
        return new ResponseEntity<>(bungs, HttpStatus.OK);
    }

    // Read: GET /bung/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Bung> getBungById(@PathVariable Long id) {
        return bungService.getBungById(id)
                .map(bung -> new ResponseEntity<>(bung, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update: PUT /bung/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Bung> updateBung(@PathVariable Long id, @RequestBody Bung bungDetails) {
        return bungService.updateBung(id, bungDetails)
                .map(updatedBung -> new ResponseEntity<>(updatedBung, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete: DELETE /bung/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBung(@PathVariable Long id) {
        if (bungService.deleteBung(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 성공적으로 삭제 시 204 No Content
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 해당 ID의 붕어빵이 없을 경우 404 Not Found
        }
    }
}
