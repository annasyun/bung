package com.bung.model;

public class Bung {
        private Long id;
        private String type; // ex: 팥, 슈크림
        private int price; // 가격
        private int quantity; // 재고
        private String name; // 이름

        // 생성자
        public Bung(Long id, String type, int price, String name, int quantity) {
            this.id = id;
            this.type = type;
            this.price = price;
            this.name = name;
            this.quantity = quantity;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            this.price = price;
        }

        public String getName() {
            return name;
        }

        public void setName(String shape) {
            this.name = name;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

    @Override
        public String toString() {
            return "Bung{" +
                    "id=" + id +
                    ", type='" + type + '\'' +
                    ", price=" + price +
                    ", name='" + name + '\'' +
                    ", quantity='" + quantity + '\'' +
                    '}';
        }
        }
