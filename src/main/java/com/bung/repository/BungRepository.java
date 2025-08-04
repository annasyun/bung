package com.bung.repository;

import com.bung.model.Bung;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class BungRepository {
    private final List<Bung> bungs = new ArrayList<>();
    private final AtomicLong sequence = new AtomicLong(0L); // ID 자동 증가를 위한 시퀀스

    // Create: 붕어빵 추가
    public Bung save(Bung bung) {
        bung.setId(sequence.incrementAndGet()); // ID 자동 할당
        bungs.add(bung);
        return bung;
    }

    // Read: 모든 붕어빵 조회
    public List<Bung> findAll() {
        return new ArrayList<>(bungs); // 불변성 유지를 위해 새로운 리스트 반환
    }

    // Read: ID로 붕어빵 조회
    public Optional<Bung> findById(Long id) {
        return bungs.stream()
                .filter(b -> b.getId().equals(id))
                .findFirst();
    }

    // Update: 붕어빵 정보 수정
    public Optional<Bung> update(Long id, Bung updatedBung) {
        return findById(id).map(existingBung -> {
            existingBung.setType(updatedBung.getType());
            existingBung.setPrice(updatedBung.getPrice());
            existingBung.setName(updatedBung.getName());
            existingBung.setQuantity(updatedBung.getQuantity());
            return existingBung;
        });
    }

    // Delete: ID로 붕어빵 삭제
    public boolean deleteById(Long id) {
        return bungs.removeIf(b -> b.getId().equals(id));
    }
}
