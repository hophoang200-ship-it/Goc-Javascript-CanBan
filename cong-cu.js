document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.querySelector("#quiz-form");
  if (quizForm) {
    const quizThongBao = document.querySelector("#quiz-thong-bao");
    const nutChamDiem = document.querySelector("#nut-cham-diem");
    const nutLamLai = document.querySelector("#nut-lam-lai");
    const nutQuizThu = document.querySelector("#nut-quiz-thu");

    function renderQuiz() {
      quizForm.innerHTML = CAU_HOI_TRAC_NGHIEM.map((cauHoi, index) => {
        const tenNhom = `cau-${index}`;
        return `
          <fieldset class="quiz-cau">
            <legend>${index + 1}. ${cauHoi.cau}</legend>
            ${cauHoi.luaChon
              .map(
                (luaChon, luaChonIndex) => `
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="${tenNhom}"
                      id="${tenNhom}-${luaChonIndex}"
                      value="${luaChonIndex}"
                    >
                    <label class="form-check-label" for="${tenNhom}-${luaChonIndex}">${luaChon}</label>
                  </div>
                `
              )
              .join("")}
          </fieldset>
        `;
      }).join("");

      quizThongBao.textContent = "";
      quizThongBao.className = "";
    }

    function layLuaChonDangChon(index) {
      const danhSach = quizForm.querySelectorAll(`input[name="cau-${index}"]`);
      const phanTuDaChon = [...danhSach].find((input) => input.checked);
      return phanTuDaChon ? Number(phanTuDaChon.value) : null;
    }

    function chamDiemQuiz() {
      let soCauDung = 0;
      const tongSoCau = CAU_HOI_TRAC_NGHIEM.length;

      CAU_HOI_TRAC_NGHIEM.forEach((cauHoi, index) => {
        const luaChonNguoiDung = layLuaChonDangChon(index);
        const daDung = luaChonNguoiDung === cauHoi.dapAn;

        if (daDung) soCauDung += 1;

        const fieldset = quizForm.querySelectorAll(".quiz-cau")[index];
        if (!fieldset) return;

        fieldset.classList.remove("thieu", "dung", "sai");
        const giaiThichCu = fieldset.querySelector(".giai-thich");
        if (giaiThichCu) giaiThichCu.remove();

        fieldset.classList.add(daDung ? "dung" : "sai");

        const thongTinGiaiThich = document.createElement("p");
        thongTinGiaiThich.className = "giai-thich mb-0";
        thongTinGiaiThich.textContent = `Giải thích: ${cauHoi.giaiThich}`;
        fieldset.appendChild(thongTinGiaiThich);
      });

      const tyLe = Math.round((soCauDung / tongSoCau) * 100);
      quizThongBao.className = "alert mt-3";
      quizThongBao.classList.add(
        soCauDung === tongSoCau
          ? "alert-success"
          : soCauDung >= Math.ceil(tongSoCau / 2)
            ? "alert-info"
            : "alert-warning"
      );

      quizThongBao.textContent = `Bạn đạt ${soCauDung}/${tongSoCau} câu đúng (${tyLe}%). ${
        soCauDung === tongSoCau
          ? "Xuất sắc!"
          : soCauDung >= Math.ceil(tongSoCau / 2)
            ? "Tốt rồi, hãy ôn thêm một chút."
            : "Hãy xem lại kiến thức và thử lại."
      }`;

      const fieldsetList = quizForm.querySelectorAll(".quiz-cau");
      fieldsetList.forEach((fieldset, index) => {
        if (layLuaChonDangChon(index) === null) {
          fieldset.classList.add("thieu");
        }
      });
    }

    function lamLaiQuiz() {
      quizForm.querySelectorAll("input[type='radio']").forEach((input) => {
        input.checked = false;
      });

      quizForm.querySelectorAll(".quiz-cau").forEach((fieldset) => {
        fieldset.classList.remove("thieu", "dung", "sai");
        const giaiThich = fieldset.querySelector(".giai-thich");
        if (giaiThich) giaiThich.remove();
      });

      quizThongBao.textContent = "";
      quizThongBao.className = "";
    }

    function dungThuQuiz() {
      quizForm.querySelectorAll(".quiz-cau").forEach((fieldset, index) => {
        const input = fieldset.querySelectorAll("input[type='radio']")[CAU_HOI_TRAC_NGHIEM[index].dapAn];
        if (input) input.checked = true;
      });

      quizThongBao.textContent = "Đã điền đáp án mẫu để bạn xem cách chấm điểm. Bấm 'Chấm điểm' để kiểm tra.";
      quizThongBao.className = "alert alert-light mt-3";
    }

    nutChamDiem.addEventListener("click", chamDiemQuiz);
    nutLamLai.addEventListener("click", lamLaiQuiz);
    nutQuizThu.addEventListener("click", dungThuQuiz);

    renderQuiz();
  }

  const baiSelect = document.querySelector("#chon-bai");
  if (baiSelect) {
    const deBai = document.querySelector("#de-bai");
    const codeInput = document.querySelector("#code-input");
    const luyenThongBao = document.querySelector("#luyen-thong-bao");
    const nutKiemTra = document.querySelector("#nut-kiem-tra");
    const nutXoaCode = document.querySelector("#nut-xoa-code");
    const nutCodeThu = document.querySelector("#nut-code-thu");

    function chuanHoaCode(nguon) {
      return String(nguon)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .replace(/[“”]/g, '"')
        .replace(/[’]/g, "'")
        .toLowerCase()
        .replace(/;$/, "");
    }

    function renderBaiLuyen() {
      baiSelect.innerHTML = BAI_LUYEN_CODE.map(
        (bai, index) => `<option value="${index}">${index + 1}</option>`
      ).join("");

      const indexHienTai = Number(baiSelect.value || 0);
      const baiHienTai = BAI_LUYEN_CODE[indexHienTai];
      deBai.textContent = baiHienTai.de;
      codeInput.value = "";
      luyenThongBao.textContent = "";
      luyenThongBao.className = "";
    }

    function kiemTraBaiLuyen() {
      const indexHienTai = Number(baiSelect.value || 0);
      const baiHienTai = BAI_LUYEN_CODE[indexHienTai];
      const ketQua = chuanHoaCode(codeInput.value);
      const ketQuaMongDoi = chuanHoaCode(baiHienTai.dapAn);

      if (!codeInput.value.trim()) {
        luyenThongBao.className = "alert alert-warning mt-3";
        luyenThongBao.textContent = "Bạn chưa nhập mã để kiểm tra.";
        return;
      }

      if (ketQua === ketQuaMongDoi) {
        luyenThongBao.className = "alert alert-success mt-3";
        luyenThongBao.textContent = "Đúng rồi! Câu trả lời của bạn khớp với đáp án mẫu.";
        return;
      }

      luyenThongBao.className = "alert alert-danger mt-3";
      luyenThongBao.textContent = `Sai rồi. Gợi ý: ${baiHienTai.goiY}`;
    }

    baiSelect.addEventListener("change", () => {
      renderBaiLuyen();
    });

    nutKiemTra.addEventListener("click", kiemTraBaiLuyen);

    nutXoaCode.addEventListener("click", () => {
      codeInput.value = "";
      luyenThongBao.textContent = "";
      luyenThongBao.className = "";
      codeInput.focus();
    });

    nutCodeThu.addEventListener("click", () => {
      const indexHienTai = Number(baiSelect.value || 0);
      codeInput.value = BAI_LUYEN_CODE[indexHienTai].dapAn;
      luyenThongBao.className = "alert alert-info mt-3";
      luyenThongBao.textContent = "Đã chèn đáp án mẫu. Bạn có thể sửa lại hoặc kiểm tra ngay.";
      codeInput.focus();
    });

    codeInput.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        kiemTraBaiLuyen();
      }
    });

    renderBaiLuyen();
  }

  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    const locNhom = document.querySelector("#loc-thuat-ngu-nhom");
    const sapXep = document.querySelector("#sap-xep-thuat-ngu");
    const ketQuaSearch = document.querySelector("#ket-qua-search");
    const demThuatNgu = document.querySelector("#dem-thuat-ngu");
    const nutXoaTim = document.querySelector("#nut-xoa-tim");

    const nhomList = [...new Set(TU_DIEN_JAVASCRIPT.map((item) => item.nhom))].sort((a, b) => a.localeCompare(b, "vi"));
    locNhom.innerHTML = [`<option value="tat-ca">Tất cả</option>`, ...nhomList.map((nhom) => `<option value="${nhom}">${nhom}</option>`)].join("");

    function renderTuDien() {
      const tuKhoa = chuanHoaTimKiem(searchInput.value);
      const nhomDangChon = locNhom.value;
      const sapXepDangChon = sapXep.value;

      let ketQua = TU_DIEN_JAVASCRIPT.filter((item) => {
        const text = chuanHoaTimKiem(`${item.ten} ${item.moTa} ${item.nhom}`);
        const khopNhom = nhomDangChon === "tat-ca" || item.nhom === nhomDangChon;
        return khopNhom && (!tuKhoa || text.includes(tuKhoa));
      });

      if (sapXepDangChon === "za") {
        ketQua = ketQua.sort((a, b) => b.ten.localeCompare(a.ten, "vi"));
      } else {
        ketQua = ketQua.sort((a, b) => a.ten.localeCompare(b.ten, "vi"));
      }

      demThuatNgu.textContent = `Hiển thị ${ketQua.length}/${TU_DIEN_JAVASCRIPT.length} thuật ngữ`;
      ketQuaSearch.innerHTML = "";

      if (ketQua.length === 0) {
        ketQuaSearch.append(taoThongBaoRong("Không tìm thấy thuật ngữ phù hợp. Hãy thử từ khóa khác."));
        return;
      }

      ketQua.forEach((item) => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-xl-4";
        col.innerHTML = `
          <article class="the h-100 p-3 rounded">
            <span class="the-nhan mb-2 d-inline-block">${item.nhom}</span>
            <h3 class="h5 mb-2">${item.ten}</h3>
            <p class="mb-0">${item.moTa}</p>
          </article>
        `;
        ketQuaSearch.appendChild(col);
      });
    }

    [searchInput, locNhom, sapXep].forEach((element) => {
      element.addEventListener("input", renderTuDien);
      element.addEventListener("change", renderTuDien);
    });

    nutXoaTim.addEventListener("click", () => {
      searchInput.value = "";
      locNhom.value = "tat-ca";
      sapXep.value = "az";
      renderTuDien();
      searchInput.focus();
    });

    renderTuDien();
  }
});
