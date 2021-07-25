import LIST from "./list.js";
import PAGING from "./paging.js";

const REGISTER = {
  init: function () {
    const self = this;
    const $app = $("#app");
    $(document).ready(function () {
      const template = `<div class="container">
                          <h2 style="text-align: center; margin-top: 30px">게시물 등록</h2>
                          <form id="registerForm">
                            <div class="input-group mb-3" style="margin-top: 30px">
                              <span class="input-group-text">제목</span>
                              <input type="text" class="inputTitle form-control" aria-label="title" placeholder="제목을 입력하세요."  id="inputTitle" name="inputTitle">
                            </div>
                            <div id="errorTitle" style="color: red"></div>
                            <div class="input-group mb-3">
                              <span class="input-group-text">내용</span>
                              <textarea class="inputContent form-control" aria-label="content" placeholder="내용을 입력하세요." id="inputContent" name="inputContent"></textarea>
                            </div>
                            <div id="errorContent" style="color: red"></div>
                            <div class="input-group mb-3">
                              <span class="input-group-text">비밀번호</span>
                              <input type="password" class="form-control" aria-label="password" placeholder="최소 8글자 이상 입력하세요." id="inputPassword" name="inputPassword">
                            </div>
                            <div id="errorPassword" style="color: red"></div>
                            <div class="input-group mb-3">
                              <span class="input-group-text">비밀번호 확인</span>
                              <input type="password" class="form-control" aria-label="passwordCheck" placeholder="비밀번호 재입력하세요." id="inputPasswordCheck" name="inputPasswordCheck">
                            </div>
                            <div id="errorPasswordCheck" style="color: red"></div>
                            <button type="button" class="btn btn-secondary" id="registerButton">등록</button>
                            <button type="button" class="btn btn-secondary" id="cancelButton">취소</button>
                            </div>
                          </form>
                        </div>`
      $app.empty();
      $app.append(template);
      self.validate();
      self.jqueryValidate();
      self.event();
    })
  },

  event: function () {
    const self = this;
    $("#registerButton").on("click", function (event) {
          const $inputTitleValue = $("#inputTitle").val();
          const $inputContentValue = $("#inputContent").val();
          const $inputPasswordValue = $("#inputPassword").val();
          const $inputPasswordCheckValue = $("#inputPasswordCheck").val();
          if ($inputTitleValue.length === 0) {
            $("#errorTitle").text("제목을 입력해주세요.");
            event.preventDefault();
          }
          if ($inputContentValue.length === 0) {
            $("#errorContent").text("내용을 입력해주세요.");
            event.preventDefault();
          }
          if ($inputPasswordValue.length === 0) {
            $("#errorPassword").text("비밀번호를 입력해주세요.");
            event.preventDefault();
          }
          if ($inputPasswordValue.length > 0 && $inputPasswordValue.length < 8) {
            $("#errorPassword").text("최소 8글자 이상 입력해주세요.");
            event.preventDefault();
          }
          if ($inputPasswordValue !== $inputPasswordCheckValue) {
            $("#errorPasswordCheck").text("비밀번호와 같지 않습니다.");
            event.preventDefault();
          }
          if ($inputPasswordCheckValue.length === 0) {
            $("#errorPasswordCheck").text("비밀번호 확인을 입력해주세요.");
            event.preventDefault();
          }
          if ($inputTitleValue.length >= 1 && $inputContentValue.length >= 1
              && $inputPasswordValue.length >= 8 && $inputPasswordValue
              === $inputPasswordCheckValue) {
            self.insertPost();
          }
        }
    );

    $("#cancelButton").on("click", function () {
      if ($("#inputTitle").val().length > 0 || $("#inputContent").val().length
          > 0) {
        if (window.confirm("입력한 내용을 저장하지 않고 나가시겠습니까?")) {
          LIST.init();
        }
      } else {
        LIST.init();
      }
    });
  },
  jqueryValidate: function () {
    $("#registerForm").validate({
      errorClass: "validError",
      messages: {
        inputTitle: {
          required: "제목을 입력하세요.",
          minlength: "한글자 이상 입력해주세요.",
          maxlength: "20자 초과할 수 없습니다."
        }
      },
      rules: {
        inputTitle: {
          required: true,
          minlength: 1,
          maxlength: 20
        },
        inputContent: {
          required: true,
          minlength: 1,
          maxlength: 100
        },
        inputPassword: {
          required: true,
          minlength: 8
        },
        inputPasswordCheck: {
          required: true,
          minlength: 8,
          equalTo: "#inputPassword"
        }
      }
    })
  },
  validate: function () {
    const $inputTitle = $("#inputTitle");
    const $errorTitle = $("#errorTitle");
    const $inputContent = $("#inputContent");
    const $errorContent = $("#errorContent");
    const $inputPassword = $("#inputPassword");
    const $errorPassword = $("#errorPassword");
    const $inputPasswordCheck = $("#inputPasswordCheck");
    const $errorPasswordCheck = $("#errorPasswordCheck");

    $inputTitle.on("input", function () {
      $errorTitle.text("");
      const inputTitleValue = $inputTitle.val();
      if (inputTitleValue[0] === " ") {
        $errorTitle.text("제목 맨 앞부분은 공백 없이 입력해주세요.")
      }
      if (inputTitleValue.length > 20) {
        $errorTitle.text("제목은 20글자 이하 입력 가능합니다.")
        $inputTitle.val(inputTitleValue.substring(0, 21));
        $("body").on("click", function (event) {
          if (!$(event.target).hasClass("input.inputTitle")) {
            $errorTitle.text("")
            $inputTitle.val(inputTitleValue.substring(0, 20));
          }
        });
      }
    });

    $inputContent.on("input", function () {
      $errorContent.text("");
      const inputContentValue = $inputContent.val();
      if (inputContentValue.length > 100) {
        $errorContent.text("내용은 100글자 이하 입력 가능합니다.")
        $inputContent.val(inputContentValue.substring(0, 101));
        $("body").on("click", function (event) {
          if (!$(event.target).hasClass("textarea.inputContent")) {
            $errorContent.text("")
            $inputContent.val(inputContentValue.substring(0, 100));
          }
        });
      }
    });

    $inputPasswordCheck.on("input", function () {
      $errorPasswordCheck.text("");
      const inputPasswordValue = $("#inputPassword").val();
      if (inputPasswordValue === '') {
        $errorPasswordCheck.text("비밀번호를 입력해주세요.")
        $inputPasswordCheck.val('');
      }
    })
    $inputPassword.on("input", function () {
      $errorPassword.text("");
      $errorPasswordCheck.text("");
    })
  },
  insertPost: function () {
    $.post("/api/board",
        {
          title: $("#inputTitle").val(),
          content: $("#inputContent").val(),
          password: $("#inputPassword").val()
        })
    .done(function () {
      alert("등록되었습니다.");
      LIST.params.postItem = 'postAll';
      LIST.params.postItemValue = '';
      PAGING.options.pageNumber = 1;
      LIST.init();
    })
  }
}

export default REGISTER;
