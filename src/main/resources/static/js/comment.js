const COMMENT = {
  init: function (postId) {
    const self = this;
    const $container = $(".container");
    const template = `<div class="input-group" style="margin-top: 15px">
                        <textarea class="form-control" placeholder="댓글을 입력하세요." id="content" aria-label="comment" aria-describedby="button-addon2"></textarea>
                      </div>
                      <div class="input-group">
                        <input type="text" aria-label="nickname" class="form-control" placeholder="닉네임" id="nickname">
                        <input type="password" aria-label="commentPassword" class="form-control" placeholder="비밀번호" id="commentPassword">
                        <button class="btn btn-outline-secondary" type="button" id="commentButton">등록</button>
                      </div>
                      
                      <div class="commentDiv" style="margin-top: 15px; margin-bottom: 30px"></div>
                      
                      <div class="modal fade" id="modifyModal" tabindex="-1" aria-labelledby="modifyModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="updateModalLabel">댓글을 수정하세요.</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="cancel"></button>
                            </div>
                            <div class="modal-body">
                              <textarea class="form-control" aria-label ="commentContentModal" id="commentContentModal" placeholder="댓글을 입력하세요."></textarea>
                              <input type="password" class="form-control" aria-label="commentPasswordModal" id="commentPasswordModal" placeholder="비밀번호 입력하세요.">
                            </div>
                            <div id="errorCommentPassword" style="color: red"></div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                              <button type="button" class="btn btn-primary" id="commentPasswordButton">확인</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="modal fade" id="nestedCommentModal" tabindex="-1" aria-labelledby="nestedCommentModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="updateModalLabel">답글을 입력하세요.</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="cancel"></button>
                            </div>
                            <div class="modal-body">
                              <textarea class="form-control" aria-label ="commentContentModal" id="nestedCommentContentModal" placeholder="답글을 입력하세요."></textarea>
                              <div class="input-group">
                                <input type="text" aria-label="nickname" class="form-control" placeholder="닉네임" id="nestedCommentNicknameModal">
                                <input type="password" class="form-control" aria-label="commentPasswordModal" id="nestedCommentPasswordModal" placeholder="비밀번호">
                              </div>
                            </div>
                            <div id="errorCommentPassword" style="color: red"></div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                              <button type="button" class="btn btn-primary" id="nestedCommentPasswordButton">확인</button>
                            </div>
                          </div>
                        </div>
                      </div>`
    $container.append(template);
    self.event(postId);
    self.getRootComment(postId);
  },
  getCommentCount: function (postId) {
    $.get(`/api/board/comment/${postId}`, {postId: postId, parentId: 0})
    .done(function (data) {
      data.forEach(function (element) {
        $.get(`/api/board/comment/${postId}/${element.id}`,
            {postId: postId, groupId: element.id})
        .done(function (data) {
          $("#" + element.id + "ds").append(data);
        });
      });
    });
  },
  getComments: function (postId, parentId, groupId, callbackFunc) {
    $.get(`/api/board/comment/${postId}`, {postId: postId, parentId: parentId})
    .done(function (data) {
      let commentTemplate = '';
      data.forEach(function (element) {
        const commentId = element.id;
        const nickname = element.nickname;
        const content = element.content;
        const groupId = element.groupId;
        const nestedCommentId = "nested" + element.id;
        commentTemplate += `<div class="row" style="border: 0.5px solid darkgrey;" id="${commentId}" data-active="no">
                                <div class="ni col- ${commentId}" style="font-size: smaller; text-align: left; margin-top: 3px">닉네임 : ${nickname}</div>
                                <div class="col-9 ${commentId}" style="text-align: left;">${content}</div>
                                <div class="md col-" style="text-align: right">
                                      <button type="button" class="btn btn-secondary btn-sm" value="nestedCommentButton" name="${commentId}" data-bs-toggle="modal" 
                                      data-bs-target="#nestedCommentModal" data-groupId="${groupId}">답글</button>
                                      <button type="button" class="btn btn-secondary btn-sm" value="commentModifyButton" name="${commentId}" data-bs-toggle="modal" 
                                data-bs-target="#modifyModal" data-groupId="${groupId}">수정</button>
                                      <button type="button" class="btn btn-primary btn-sm" value="commentDeleteButton" name="${commentId}" data-bs-toggle="modal" 
                                data-bs-target="#passwordModal" data-groupId="${groupId}">삭제</button>
                                </div>
                                <div class="col" style="text-align: left; margin-bottom: 5px">
                                  <button type="button" value="showCommentButton" name="${commentId}" id="${commentId}ds"><img src="/chat.png" alt="chat" height="20px" width="20px"></button>
                                </div>
                                <div id="${nestedCommentId}" style="border: 0.5px solid darkgrey;"></div>
                            </div>`;
      });
      callbackFunc(commentTemplate);
    });
  },
  getRootComment: function (postId) {
    const self = this;
    self.getComments(postId, 0, 0, function (commentTemplate) { //groupId 추가해서 자식에서 루트Id 알게 해준다.
      $("div.commentDiv").empty().append(commentTemplate);
      self.getCommentCount(postId);
      self.commentDetail(postId);
    });
  },
  showComment: function (postId, commentId, groupId, checkFunc) { //기능 쪼개기
    const self = this;
    let preCommentId = groupId;
    let rootCommentId = "nested" + groupId;
    if (groupId === '0' && checkFunc === "deleteFunc") { //string -> 상수로 변경.(개발자 실수때문)
      $("div#" + commentId).remove();
    } else {
      if (groupId === '0' && checkFunc === "insertFunc") {
        rootCommentId = "nested" + commentId;
        preCommentId = commentId;
      }
      $("div#" + rootCommentId).empty();
      $.get(`/api/board/comment/${postId}`,
          {postId: postId, parentId: preCommentId})
      .done(function (data) {
        data.forEach(function (element) {
          const commentId = element.id;
          const nickname = element.nickname;
          const content = element.content;
          const secondCommentId = "nested" + element.id;
          const div_str = `<div class="row" style="border-top: 0.5px solid darkgrey; background-color: lightgray;" id="${commentId}" >
                                <div style="text-align: left">↳</div>
                                <div class="col-" style="font-size: smaller; text-align: left; margin-top: 3px">닉네임 : ${nickname}</div>
                                <div class="col-9" style="text-align: left;">${content}</div>
                                <div class="md col-" style="text-align: right">
                                      <button type="button" class="btn btn-secondary btn-sm" value="nestedCommentButton" name="${commentId}" data-bs-toggle="modal"
                                  data-bs-target="#nestedCommentModal" data-groupId="${groupId}">답글</button>
                                      <button type="button" class="btn btn-secondary btn-sm" value="commentModifyButton" name="${commentId}" data-bs-toggle="modal"
                                data-bs-target="#modifyModal" data-groupId="${groupId}">수정</button>
                                      <button type="button" class="btn btn-primary btn-sm" value="commentDeleteButton" name="${commentId}" data-bs-toggle="modal"
                                data-bs-target="#passwordModal" data-groupId="${groupId}">삭제</button>
                                </div>
                                <div class="col" style="text-align: left; margin-bottom: 5px"></div>
                                <div id="${secondCommentId}" style="border-top: 0.5px solid darkgrey; background-color: darkgray; "></div>
                             </div>`;
          $("#" + rootCommentId).append(div_str);
          self.getComments(postId, commentId, groupId,
              function (commentTemplate) {
                $("#" + secondCommentId).append(commentTemplate);
                $("#" + secondCommentId + " div.ni.col-").before(
                    `<div style="text-align: left">↳</div><div style="text-align: left">&nbsp&nbsp↳</div>`);
                $("#" + secondCommentId
                    + " div.md.col- button[value|='nestedCommentButton']").remove();
                $("#" + secondCommentId + " div.col").remove();
                self.commentDetail(postId);
              });
        });
      });
    }
  },
  commentDetail: function (postId) {
    const self = this;
    let nestedCommentModal = new bootstrap.Modal(
        document.getElementById('nestedCommentModal'), {
          keyboard: false
        });
    let modifyModal = new bootstrap.Modal(
        document.getElementById('modifyModal'), {
          keyboard: false
        });
    let passwordModal = new bootstrap.Modal(
        document.getElementById('passwordModal'), {
          keyboard: false
        });

    $("div.md > button[value|='nestedCommentButton']").off().on("click",
        function () {
          const commentID = $(this).attr('name');
          const groupId = $(this).attr('data-groupId');
          $("#nestedCommentPasswordButton").off().on("click", function () {
            $.post(`/api/board/comment`,
                {
                  postId: postId,
                  content: $("#nestedCommentContentModal").val(),
                  password: $("#nestedCommentPasswordModal").val(),
                  parentId: commentID,
                  groupId: commentID,
                  nickname: $("#nestedCommentNicknameModal").val()
                })
            .done(function () {
              $("#nestedCommentContentModal").val('');
              $("#nestedCommentPasswordModal").val('');
              $("#nestedCommentNicknameModal").val('');
              nestedCommentModal.hide();
              self.showComment(postId, commentID, groupId, "insertFunc");
            });
          });
        });
    $("div.md > button[value|='commentDeleteButton']").off().on("click",
        function () {
          const commentID = $(this).attr('name');
          const groupId = $(this).attr('data-groupId');
          $("#errorPassword").text("");
          const $inputPassword = $("#inputPassword");
          $inputPassword.val('');
          $inputPassword.on("input", function () {
            $("#errorPassword").text("");
          })

          $("#passwordButton").off().on("click", function () {
            $.ajax({
              url: "/api/board/comment",
              type: "DELETE",
              data: {id: commentID, password: $inputPassword.val()}
            })
            .done(function (data) {
              if (data) {
                alert("삭제되었습니다.")
                passwordModal.hide();
                self.showComment(postId, commentID, groupId, "deleteFunc");
              } else {
                $("#errorPassword").text("비밀번호가 일치하지 않습니다.");
              }
            })
          })
        });
    $("div.md > button[value|='commentModifyButton']").off().on("click",
        function () {
          const commentID = $(this).attr('name');
          const groupId = $(this).attr('data-groupId');
          $("#errorCommentPassword").text("");
          const $commentPasswordModal = $("#commentPasswordModal");
          $commentPasswordModal.val('');
          $commentPasswordModal.on("input", function () {
            $("#errorCommentPassword").text("");
          })
          $.get(`/api/board/comment`, {id: commentID})
          .done(function (data) {
            $("#commentContentModal").val(data.content);
          })
          $("#commentPasswordButton").off().on("click", function () {
            $.ajax({
              url: "/api/board/comment",
              type: "PUT",
              data: {
                id: commentID,
                content: $("#commentContentModal").val(),
                password: $("#commentPasswordModal").val()
              }
            })
            .done(function (data) {
              if (data) {
                alert("수정되었습니다.")
                modifyModal.hide();
                if (groupId === '0') {
                  $("div#" + commentID + " div.col-9." + commentID).text(
                      $("#commentContentModal").val());
                }
                self.showComment(postId, commentID, groupId, "modifyFunc");
              } else {
                $("#errorCommentPassword").text("비밀번호가 일치하지 않습니다.");
              }
            })
          })
        });
    $("div.col > button[value|='showCommentButton']").off().on("click",
        function () {
          const preCommentId = $(this).attr('name');
          const rootCommentId = "nested" + preCommentId;
          self.showComment(postId, preCommentId, preCommentId, "showFunc");
          $("div#" + rootCommentId).toggle();
        }
    );
  },
  event: function (postId) {
    const self = this;
    $("#commentButton").on("click", function () {
      $.post(`/api/board/comment`,
          {
            postId: postId,
            content: $("#content").val(),
            password: $("#commentPassword").val(),
            nickname: $("#nickname").val()
          })
      .done(function () {
        $.get(`/api/board/comment/${postId}`,
            {postId: postId, parentId: 0})
        .done(function (data) {
          const commentId = data[0].id;
          const nestedCommentId = "nested" + commentId;
          const groupId = 0;
          const nickname = $("#nickname").val();
          const content = $("#content").val();
          const dataCount = 0;
          $("#content").val('');
          $("#commentPassword").val('');
          $("#nickname").val('');
          // $("div.commentDiv").empty();
          // DETAIL.getRootComment(postId);
          $("div.commentDiv").prepend(
              `<div class="row" style="border: 0.5px solid darkgrey;" id="${commentId}" >
                                        <div class="ni col- ${commentId}" style="font-size: smaller; text-align: left; margin-top: 3px">닉네임 : ${nickname}</div>
                                        <div class="col-9 ${commentId}" style="text-align: left;">${content}</div>
                                        <div class="md col-" style="text-align: right">
                                              <button type="button" class="btn btn-secondary btn-sm" value="nestedCommentButton" name="${commentId}" data-bs-toggle="modal" 
                                              data-bs-target="#nestedCommentModal" data-groupId="${groupId}">답글</button>
                                              <button type="button" class="btn btn-secondary btn-sm" value="commentModifyButton" name="${commentId}" data-bs-toggle="modal" 
                                        data-bs-target="#modifyModal" data-groupId="${groupId}">수정</button>
                                              <button type="button" class="btn btn-primary btn-sm" value="commentDeleteButton" name="${commentId}" data-bs-toggle="modal" 
                                        data-bs-target="#passwordModal"data-groupId="${groupId}">삭제</button>
                                        </div>
                                        <div class="col" style="text-align: left; margin-bottom: 5px">
                                          <button type="button" value="showCommentButton" name="${commentId}"><img src="/chat.png" alt="chat" height="20px" width="20px"> ${dataCount} </button>
                                        </div>
                                        <div id="${nestedCommentId}" style="border: 0.5px solid darkgrey;"></div>
                                       </div>`)
          self.commentDetail(postId);
        });
      });
    });
  }
}
export default COMMENT;
