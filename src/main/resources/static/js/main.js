// main.js

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================================
    // 1. 모든 DOM 요소 변수를 DOMContentLoaded 스코프 최상단에 선언
    // ==========================================================
    const checkBungStockBtn = document.getElementById('checkBungStockBtn');
    const bungItemsBody = document.getElementById('bungItems');
    const noStockMessage = document.getElementById('noStockMessage');

    // 폼 관련 요소들 (기존 이름 유지)
    const registerBungBtn = document.getElementById('registerBungBtn'); // "붕어빵메뉴등록" 버튼
    const bungRegisterDiv = document.getElementById('bungRegister'); // 폼 컨테이너
    const formTitle = document.getElementById('formTitle'); // 폼 제목 (새로 추가)
    const registerForm = document.getElementById('registerForm'); // 폼 자체
    const bungIdInput = document.getElementById('bungId'); // 숨김 ID 필드 (새로 추가)
    const nameInput = document.getElementById('name'); // 이름 입력 필드
    const typeInput = document.getElementById('type'); // 종류 입력 필드
    const priceInput = document.getElementById('price'); // 가격 입력 필드
    const quantityInput = document.getElementById('quantity'); // 수량 입력 필드
    const submitFormBtn = document.getElementById('submitFormBtn'); // 폼 제출 버튼 (새로 추가)
    const cancelRegisterBtn = document.getElementById('cancelRegisterBtn'); // 폼 취소 버튼
    const registerMessage = document.getElementById('registerMessage'); // 메시지 표시 영역

    let isEditMode = false; // 현재 폼이 수정 모드인지 등록 모드인지 구분하는 플래그


    // ==========================================================
    // 2. 이벤트 위임을 사용한 붕어빵 삭제/수정 버튼 리스너 (DOMContentLoaded 시점에 단 한 번만 등록)
    // ==========================================================
    if (bungItemsBody) {
        bungItemsBody.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-btn')) { // 삭제 버튼 클릭
                const bungId = event.target.dataset.id;
                if (confirm(`${bungId}번 붕어빵을 정말로 삭제하시겠습니까?`)) {
                    deleteBung(bungId);
                }
            } else if (event.target.classList.contains('edit-btn')) { // 수정 버튼 클릭
                const bungId = event.target.dataset.id;
                openEditForm(bungId); // 수정 폼을 여는 함수 호출
            }
        });
    }


    // ==========================================================
    // 3. 붕어빵 재고 확인 기능 (기존과 동일, 변수명 업데이트)
    // ==========================================================
    checkBungStockBtn.addEventListener('click', function() {
        fetch('/bung')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(bungs => {
                bungItemsBody.innerHTML = '';

                if (bungs.length === 0) {
                    if (noStockMessage) {
                        noStockMessage.style.display = 'block';
                    }
                } else {
                    if (noStockMessage) {
                        noStockMessage.style.display = 'none';
                    }
                    bungs.forEach(bung => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${bung.id}</td>
                            <td>${bung.name}</td>
                            <td>${bung.type}</td>
                            <td>${bung.price}원</td>
                            <td>${bung.quantity}개</td>
                            <td>
                                <button class="edit-btn" data-id="${bung.id}">수정</button>
                                <button class="delete-btn" data-id="${bung.id}">삭제</button>
                            </td>
                        `;
                        bungItemsBody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('재고 정보를 불러오는 데 실패했습니다:', error);
                bungItemsBody.innerHTML = '<tr><td colspan="6" style="color: red;">재고 정보를 불러오는 데 실패했습니다.</td></tr>';
                if (noStockMessage) {
                    noStockMessage.style.display = 'none';
                }
            });
    });


    // ==========================================================
    // 4. 붕어빵 메뉴 등록/수정 폼 관련 기능 (기존 이름 유지하며 기능 추가)
    // ==========================================================

    // "붕어빵메뉴등록" 버튼 클릭 시 폼 열기
    registerBungBtn.addEventListener('click', function() { // 기존 ID 유지
        isEditMode = false; // 등록 모드
        formTitle.textContent = '새 붕어빵 메뉴 등록'; // 폼 제목
        submitFormBtn.textContent = '등록하기'; // 제출 버튼 텍스트
        bungRegisterDiv.style.display = 'block'; // 기존 ID 유지
        registerMessage.style.display = 'none'; // 기존 ID 유지
        registerForm.reset(); // 폼 초기화
        bungIdInput.value = ''; // 숨김 ID 필드 초기화
    });

    // 폼 취소 버튼 클릭 시 폼 닫기
    cancelRegisterBtn.addEventListener('click', function() { // 기존 ID 유지
        bungRegisterDiv.style.display = 'none'; // 기존 ID 유지
    });

    // 폼 제출 (등록 또는 수정)
    registerForm.addEventListener('submit', function(event) { // 기존 ID 유지
        event.preventDefault();

        const id = bungIdInput.value ? parseInt(bungIdInput.value) : null; // 수정 시 ID 사용
        const name = nameInput.value;
        const type = typeInput.value;
        const price = parseInt(priceInput.value);
        const quantity = parseInt(quantityInput.value);

        if (!name || !type || isNaN(price) || isNaN(quantity)) {
            registerMessage.textContent = '모든 필드를 올바르게 입력해주세요.';
            registerMessage.classList.remove('success');
            registerMessage.classList.add('error');
            registerMessage.style.display = 'block';
            return;
        }

        const bungData = {
            name: name,
            type: type,
            price: price,
            quantity: quantity
        };

        let url = '/bung';
        let method = 'POST';

        if (isEditMode && id) { // 수정 모드이고 ID가 있을 때
            url = `/bung/${id}`;
            method = 'PUT';
            bungData.id = id; // PUT 요청 시 ID도 함께 보내야 함
        }

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bungData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || `작업 실패: ${response.status} ${response.statusText}`);
                }).catch(() => {
                    throw new Error(`작업 실패: ${response.status} ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            registerMessage.textContent = `붕어빵이 성공적으로 ${isEditMode ? '수정' : '등록'}되었습니다! (ID: ${data.id})`;
            registerMessage.classList.remove('error');
            registerMessage.classList.add('success');
            registerMessage.style.display = 'block';
            registerForm.reset(); // 폼 초기화
            bungRegisterDiv.style.display = 'none'; // 폼 숨기기
            checkBungStockBtn.click(); // 재고 목록 자동 새로고침
        })
        .catch(error => {
            console.error('작업 중 오류 발생:', error);
            registerMessage.textContent = `${isEditMode ? '수정' : '등록'}에 실패했습니다: ` + error.message;
            registerMessage.classList.remove('success');
            registerMessage.classList.add('error');
            registerMessage.style.display = 'block';
        });
    });

    // 특정 붕어빵 정보를 가져와 수정 폼을 채우는 함수 (새로 추가)
    function openEditForm(id) {
        fetch(`/bung/${id}`) // GET /bung/{id} 엔드포인트 호출
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(bung => {
                isEditMode = true; // 수정 모드
                formTitle.textContent = `붕어빵 메뉴 수정 (ID: ${bung.id})`; // 폼 제목 변경
                submitFormBtn.textContent = '수정하기'; // 제출 버튼 텍스트 변경

                // 폼 필드 채우기 (기존 input ID 사용)
                bungIdInput.value = bung.id;
                nameInput.value = bung.name;
                typeInput.value = bung.type;
                priceInput.value = bung.price;
                quantityInput.value = bung.quantity;

                registerMessage.style.display = 'none'; // 메시지 숨기기
                bungRegisterDiv.style.display = 'block'; // 폼 보여주기
            })
            .catch(error => {
                console.error('붕어빵 정보를 불러오는 데 실패했습니다:', error);
                alert('수정할 붕어빵 정보를 불러오는 데 실패했습니다: ' + error.message);
            });
    }

    // ==========================================================
    // 5. 붕어빵 삭제 기능 함수 (기존과 동일, 변수명 업데이트)
    // ==========================================================
    function deleteBung(id) {
        fetch(`/bung/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.status === 204) {
                alert(`${id}번 붕어빵이 성공적으로 삭제되었습니다.`);
                checkBungStockBtn.click(); // 삭제 후 재고 목록 새로고침
            } else if (response.status === 404) {
                alert(`${id}번 붕어빵을 찾을 수 없습니다.`);
            } else {
                return response.text().then(text => {
                    throw new Error(text || `삭제 실패: ${response.status} ${response.statusText}`);
                });
            }
        })
        .catch(error => {
            console.error('Error deleting bung:', error);
            alert('붕어빵 삭제에 실패했습니다: ' + error.message);
        });
    }

}); // DOMContentLoaded 닫힘