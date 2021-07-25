import LIST from "./list.js";
import MODIFY from "./modify.js";
import COMMENT from "./comment.js";

const DETAIL = {
  init: function (postId) {
    const self = this;
    const $app = $("#app");
    $("body").removeClass("modal-open").removeAttr("style");
    $(document).ready(function () {
      const template = `<div class="container">
                          <h2 style="text-align: center; margin-top: 30px">상세 페이지</h2>
                          <div id="detailUpdateDate" style="text-align: right">업데이트 : </div>
                          <div class="input-group mb-3" style="margin-top: 5px">
                            <span class="input-group-text">제목</span>
                            <input type="text" class="form-control" aria-label="title" id="detailTitle" disabled>
                          </div>
                          <div class="input-group mb-3">
                            <span class="input-group-text">내용</span>
                            <div class="form-control" aria-label="content" id="detailContent" style="background-color:#e8ebed; width:500px; height:82px; resize: both"></div>
                          </div>
                          <div style="text-align: center; margin-top: 30px">
                            <button type="button" class="btn btn-secondary" id="listButton">목록</button>
                            <button type="button" class="btn btn-secondary" data-bs-toggle="modal" 
                            data-bs-target="#passwordModal" id="modifyButton">수정</button>
                            <button type="button" class="btn btn-secondary" data-bs-toggle="modal" 
                            data-bs-target="#passwordModal" id="deleteButton">삭제</button>
                          </div>
                        </div>
                        <nav aria-label="pagination" id="pageNav">
                        <ul class="pagination justify-content-center" id="pageUl"></ul>
                        </nav>`
      $app.empty();
      $app.append(template);
      self.getPost(postId);
      self.event(postId);
      COMMENT.init(postId);
    })
  },
  getPost: function (postId) {
    $.get(`/api/board/${postId}`)
    .done(function (data) {
      $("#detailTitle").val(data.title);
      $("#detailContent").empty().append(data.content);
      $("#detailUpdateDate").empty().append(
          "업데이트 날짜 :" + data.updateDate.substring(0, 10));
    })
  },

  event: function (postId) {
    $("#listButton").on("click", function () {
      LIST.init();
    });
    $("#modifyButton").on("click", function () {
      $("#errorPassword").text("");
      const $inputPassword = $("#inputPassword");
      $inputPassword.val('');
      $inputPassword.on("input", function () {
        $("#errorPassword").text("");
      })
      $("#passwordButton").off().on("click", function () {
        $.get(`/api/board/checkPwd`,
            {postId: postId, password: $("#inputPassword").val()})
        .done(
            function (data) {
              if (data) {
                $(".modal").toggle().hide();
                $(".modal-backdrop").hide();
                $("body").removeClass("modal-open").removeAttr("style");
                MODIFY.init(postId);
              } else {
                $("#errorPassword").text("비밀번호가 일치하지 않습니다.");
              }
            })
      })
    });
    $("#deleteButton").on("click", function () {
      $("#errorPassword").text("");
      const $inputPassword = $("#inputPassword");
      $inputPassword.val('');
      $inputPassword.on("input", function () {
        $("#errorPassword").text("");
      })
      $("#passwordButton").off().on("click", function () {
        $.ajax({
          url: "/api/board",
          type: "DELETE",
          data: {postId: postId, password: $inputPassword.val()}
        })
        .done(function (data) {
          if (data) {
            alert("삭제되었습니다.")
            $(".modal").hide();
            $(".modal-backdrop").hide();
            $("body").removeClass("modal-open").removeAttr("style");
            LIST.init();
          } else {
            $("#errorPassword").text("비밀번호가 일치하지 않습니다.");
          }
        })
      })
    });
  }
}
export default DETAIL;


