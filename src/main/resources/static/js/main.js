document.addEventListener('DOMContentLoaded', function() { // HTML 문서가 완전히 로드된 후에 실행되도록
    document.getElementById('checkBungStockBtn').addEventListener('click', function() {
        fetch('/bung') // GET /bung 엔드포인트 호출 (BungController의 getAllBungs)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json(); // JSON 응답 파싱
            })
            .then(bungs => {
                const bungItemsBody = document.getElementById('bungItems');
                const noStockMessage = document.getElementById('noStockMessage'); // Add this line
                bungItemsBody.innerHTML = ''; // 기존 목록 초기화

                if (bungs.length === 0) {
                    bungItemsBody.innerHTML = '<tr><td colspan="4">현재 붕어빵 재고가 없습니다.</td></tr>'; // Modify this line for table
                    noStockMessage.style.display = 'block'; // If you want to use the separate message element
                } else {
                    noStockMessage.style.display = 'none'; // If you want to use the separate message element
                    bungs.forEach(bung => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${bung.id}</td>
                            <td>${bung.type}</td>
                            <td>${bung.price}원</td>
                            <td>${bung.shape}</td>
                        `;
                        bungItemsBody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                const bungItemsBody = document.getElementById('bungItems');
                bungItemsBody.innerHTML = '<tr><td colspan="4" style="color: red;">재고 정보를 불러오는 데 실패했습니다.</td></tr>';
                // If you have a separate noStockMessage element, you might also want to hide it here:
                // document.getElementById('noStockMessage').style.display = 'none';
            });
    });
});