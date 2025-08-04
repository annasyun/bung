package com.bung.service;

import com.bung.model.Bung;
import com.bung.repository.BungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BungService {
    private final BungRepository bungRepository;

    @Autowired
    public BungService(BungRepository bungRepository) {
        this.bungRepository = bungRepository;
    }

    // 붕어빵 생성
    public Bung createBung(Bung bung) {
        return bungRepository.save(bung);
    }

    // 모든 붕어빵 조회
    public List<Bung> getAllBungs() {
        return bungRepository.findAll();
    }

    // ID로 붕어빵 조회
    public Optional<Bung> getBungById(Long id) {
        return bungRepository.findById(id);
    }

    // 붕어빵 정보 수정
    public Optional<Bung> updateBung(Long id, Bung bungDetails) {
        return bungRepository.update(id, bungDetails);
    }

    // 붕어빵 삭제
    public boolean deleteBung(Long id) {
        return bungRepository.deleteById(id);
    }
}
