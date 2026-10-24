(() => {
  const quizForm = document.querySelector("#quiz-form");
  const quizThongBao = document.querySelector("#quiz-thong-bao");
  const nutChamDiem = document.querySelector("#nut-cham-diem");
  const nutLamLai = document.querySelector("#nut-lam-lai");
  const nutQuizThu = document.querySelector("#nut-quiz-thu");

  if (quizForm && Array.isArray(CAU_HOI_TRAC_NGHIEM)) {
    function renderQuiz() {
      quizForm.innerHTML = CAU_HOI_TRAC_NGHIEM.map((item, index) => {
        const options = item.luaChon.map((choice, choiceIndex) => `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="cau-${index}" id="cau-${index}-${choiceIndex}" value="${choiceIndex}">
            <label class="form-check-label" for="cau-${index}-${choiceIndex}">${choice}</label>
          </div>
        `).join("");

        return `
          <fieldset class="quiz-cau">
            <legend>${index + 1}. ${item.cau}</legend>
            ${options}
          </fieldset>
        `;
      }).join("");

      quizThongBao.textContent = "";
      quizThongBao.className = "";
    }

    function danhGiaQuiz() {
      const fieldsets = [...quizForm.querySelectorAll(".quiz-cau")];
      let soDung = 0;

      fieldsets.forEach((fieldset, index) => {
        const question = CAU_HOI_TRAC_NGHIEM[index];
        const selected = fieldset.querySelector(`input[name="cau-${index}"]:checked`);
        fieldset.classList.remove("dung", "sai", "thieu");

        const giaiThich = document.createElement("p");
        giaiThich.className = "giai-thich mb-0";

        if (!selected) {
          fieldset.classList.add("thieu");
          giaiThich.textContent = `Chưa chọn đáp án. Đáp án đúng là: ${question.luaChon[question.dapAn]}.`;
          fieldset.appendChild(giaiThich);
          return;
        }

        const isCorrect = Number(selected.value) === question.dapAn;
        if (isCorrect) {
          soDung += 1;
          fieldset.classList.add("dung");
          giaiThich.textContent = "Đúng rồi! " + question.giaiThich;
        } else {
          fieldset.classList.add("sai");
          giaiThich.textContent = `Sai rồi. Đáp án đúng là: ${question.luaChon[question.dapAn]}. ${question.giaiThich}`;
        }
        fieldset.appendChild(giaiThich);
      });

      const tong = fieldsets.length;
      quizThongBao.className = "ket-qua-tuc-thoi mt-3";
      quizThongBao.innerHTML = `<strong>Kết quả:</strong> ${soDung}/${tong} câu đúng.`;
    }

    nutChamDiem.addEventListener("click", danhGiaQuiz);
    nutLamLai.addEventListener("click", () => {
      quizForm.reset();
      quizThongBao.textContent = "";
      quizThongBao.className = "";
      quizForm.querySelectorAll(".quiz-cau").forEach((fieldset) => {
        fieldset.classList.remove("dung", "sai", "thieu");
        const giaiThich = fieldset.querySelector(".giai-thich");
        if (giaiThich) giaiThich.remove();
      });
    });

    nutQuizThu.addEventListener("click", () => {
      const inputs = quizForm.querySelectorAll('input[type="radio"]');
      inputs.forEach((input) => {
        const questionIndex = Number(input.name.replace("cau-", ""));
        const question = CAU_HOI_TRAC_NGHIEM[questionIndex];
        const shouldCheck = Number(input.value) === question.dapAn;
        input.checked = shouldCheck;
      });
      quizThongBao.className = "ket-qua-tuc-thoi mt-3";
      quizThongBao.textContent = "Đã gán đáp án mẫu cho bạn xem. Bấm Chấm điểm để kiểm tra.";
    });

    renderQuiz();
  }

  const baiSelect = document.querySelector("#chon-bai");
  const deBai = document.querySelector("#de-bai");
  const codeInput = document.querySelector("#code-input");
  const nutKiemTra = document.querySelector("#nut-kiem-tra");
  const nutXoaCode = document.querySelector("#nut-xoa-code");
  const nutCodeThu = document.querySelector("#nut-code-thu");
  const luyenThongBao = document.querySelector("#luyen-thong-bao");

  if (baiSelect && Array.isArray(BAI_LUYEN_CODE)) {
    function renderBaiLuyen() {
      baiSelect.innerHTML = BAI_LUYEN_CODE.map((bai, index) => `
        <option value="${index}">${index + 1}</option>
      `).join("");

      const index = Number(baiSelect.value || 0);
      const bai = BAI_LUYEN_CODE[index];
      deBai.textContent = bai.de;
      codeInput.value = "";
      luyenThongBao.textContent = "";
      luyenThongBao.className = "";
    }

    function kiemTraBaiLuyen() {
      const index = Number(baiSelect.value || 0);
      const bai = BAI_LUYEN_CODE[index];
      const nguoiDung = (codeInput.value || "").trim();
      const ketQuaMuon = boNhoTrongChuoi(bai.dapAn);
      const nguoiDungNho = boNhoTrongChuoi(nguoiDung);
      const dung = nguoiDungNho === ketQuaMuon || nguoiDungNho.includes(ketQuaMuon);

      luyenThongBao.className = "ket-qua-tuc-thoi mt-3";
      if (dung) {
        luyenThongBao.textContent = "Đúng rồi! Bạn đã viết đúng cú pháp gần như đáp án mẫu.";
      } else {
        luyenThongBao.innerHTML = `<strong>Chưa đúng:</strong> ${bai.goiY}`;
      }
    }

    baiSelect.addEventListener("change", () => {
      const index = Number(baiSelect.value || 0);
      const bai = BAI_LUYEN_CODE[index];
      deBai.textContent = bai.de;
      codeInput.value = "";
      luyenThongBao.textContent = "";
      luyenThongBao.className = "";
    });

    nutKiemTra.addEventListener("click", kiemTraBaiLuyen);
    nutXoaCode.addEventListener("click", () => {
      codeInput.value = "";
      luyenThongBao.textContent = "";
      luyenThongBao.className = "";
      codeInput.focus();
    });
    nutCodeThu.addEventListener("click", () => {
      const index = Number(baiSelect.value || 0);
      codeInput.value = BAI_LUYEN_CODE[index].dapAn;
      luyenThongBao.textContent = "Đã chèn đáp án mẫu để bạn so sánh.";
      luyenThongBao.className = "ket-qua-tuc-thoi mt-3";
    });

    codeInput.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        kiemTraBaiLuyen();
      }
    });

    renderBaiLuyen();
  }

  const searchInput = document.querySelector("#search-input");
  const locNhom = document.querySelector("#loc-thuat-ngu-nhom");
  const sapXep = document.querySelector("#sap-xep-thuat-ngu");
  const demKetQua = document.querySelector("#dem-thuat-ngu");
  const ketQuaSearch = document.querySelector("#ket-qua-search");
  const nutXoaTim = document.querySelector("#nut-xoa-tim");

  if (searchInput && locNhom && sapXep && demKetQua && ketQuaSearch && Array.isArray(TU_DIEN_JAVASCRIPT)) {
    const nhomList = [...new Set(TU_DIEN_JAVASCRIPT.map((item) => item.nhom))];
    locNhom.innerHTML = ['<option value="tat-ca">Tất cả</option>']
      .concat(nhomList.map((nhom) => `<option value="${nhom}">${nhom}</option>`))
      .join("");

    function renderTuDien() {
      const tuKhoa = chuanHoaTimKiem(searchInput.value);
      const nhom = locNhom.value;
      const sortMode = sapXep.value;

      let ketQua = TU_DIEN_JAVASCRIPT.filter((item) => {
        const text = chuanHoaTimKiem(`${item.ten} ${item.nhom} ${item.moTa}`);
        const khopTuKhoa = !tuKhoa || text.includes(tuKhoa);
        const khopNhom = nhom === "tat-ca" || item.nhom === nhom;
        return khopTuKhoa && khopNhom;
      });

      if (sortMode === "za") {
        ketQua = [...ketQua].sort((a, b) => b.ten.localeCompare(a.ten, "vi"));
      } else {
        ketQua = [...ketQua].sort((a, b) => a.ten.localeCompare(b.ten, "vi"));
      }

      demKetQua.textContent = `Hiển thị ${ketQua.length}/${TU_DIEN_JAVASCRIPT.length} thuật ngữ`;

      if (ketQua.length === 0) {
        ketQuaSearch.innerHTML = '<div class="col-12"><p class="tb-rong mb-0">Không tìm thấy thuật ngữ nào phù hợp.</p></div>';
        return;
      }

      ketQuaSearch.innerHTML = ketQua.map((item) => `
        <div class="col-12 col-md-6 col-xl-4">
          <article class="the-thuat-ngu">
            <span class="the-nhan">${item.nhom}</span>
            <h3>${item.ten}</h3>
            <p>${item.moTa}</p>
          </article>
        </div>
      `).join("");
    }

    [searchInput, locNhom, sapXep].forEach((element) => {
      element.addEventListener("input", renderTuDien);
      element.addEventListener("change", renderTuDien);
    });

    nutXoaTim.addEventListener("click", () => {
      searchInput.value = "";
      renderTuDien();
      searchInput.focus();
    });

    renderTuDien();
  }
})();
