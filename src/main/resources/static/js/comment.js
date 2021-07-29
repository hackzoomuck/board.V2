import PAGING from "./paging.js";

const COMMENT = {
  init: function (postId) {
    const self = this;
    const $comment = $(".comment");
    COMMENT.options.commentActive.forEach(function () {
      COMMENT.options.commentActive.pop();
    })
    COMMENT.pagingOptions.postId = postId;
    PAGING.options = $.extend({}, PAGING.options, COMMENT.pagingOptions);
    const template = `<div class="input-group" style="margin-top: 15px">
                        <textarea class="form-control" placeholder="댓글을 입력하세요." id="content" aria-label="comment" aria-describedby="button-addon2"></textarea>
                      </div>
                      <div class="input-group">
                        <input type="text" aria-label="nickname" class="form-control" placeholder="닉네임" id="nickname">
                        <input type="password" aria-label="commentPassword" class="form-control" placeholder="비밀번호" id="commentPassword">
                        <button class="btn btn-outline-secondary" type="button" id="commentButton">등록</button>
                      </div>
                      
                      <div class="commentDiv" style="margin-top: 15px; margin-bottom: 30px"></div>
                      
                      <nav aria-label="pagination" id="pageNav">
                        <ul class="pagination justify-content-center" id="pageUl"></ul>
                      </nav>
                      
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
    $comment.empty().append(template);
    $("#pageUl").empty();
    self.event(postId);
    self.getRootComment(postId);
  },
  getComments: function (postId, parentId, callbackFunc) {
    $.get(`/api/board/comment/${postId}/${parentId}`)
    .done(function (data) {
      let commentTemplate = '';

      let startIdx = 0;
      let endIdx = data.length;

      if (parentId === 0 && endIdx > 0) {
        PAGING.options.totalCount = data.length;
        PAGING.setStartEndPage();
        if (PAGING.variable.totalPageNumber
            < COMMENT.pagingOptions.pageNumber) {
          COMMENT.pagingOptions.pageNumber = PAGING.variable.totalPageNumber;
          PAGING.options.pageNumber = COMMENT.pagingOptions.pageNumber;
          PAGING.setStartEndPage();
        }
        const pageNumber = COMMENT.pagingOptions.pageNumber;
        const listSize = COMMENT.pagingOptions.listSize;
        startIdx = (pageNumber - 1) * listSize;
        endIdx = pageNumber * listSize;
      }

      for (let i = startIdx; i < endIdx && i < data.length; i++) {
        const commentId = data[i].id;
        const nickname = data[i].nickname;
        const content = data[i].content;
        const groupId = data[i].groupId;
        const nestedCommentId = "nested" + data[i].id;
        const nestedCommentCnt = data[i].commentCnt;
        commentTemplate += `<div class="row" style="border: 1px solid darkgrey;" id="${commentId}">
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
                                  <button type="button" value="showCommentButton" name="${commentId}" data-groupId="${groupId}"><img src="/chat.png" alt="chat" height="20px" width="20px">${nestedCommentCnt}</button>
                                </div>
                                <div id="${nestedCommentId}" style="border: 1px solid darkgrey; display: none"></div>
                            </div>`;
      }
      callbackFunc(commentTemplate);

      if (parentId === 0 && endIdx === 0) {
        $("#pageUl").empty();
      } else {
        PAGING.init();
      }

    });
  },
  commentActiveCheck: function (postId) {
    COMMENT.options.commentActive.forEach(function (commentId) {
      COMMENT.showComment(postId, commentId);
      $("div#nested" + commentId).toggle();//showComment 내에 존재해야함.
    })
  },
  getRootComment: function (postId) {
    $("div.commentDiv").empty()
    COMMENT.getComments(postId, 0, function (commentTemplate) {
      $("div.commentDiv").append(commentTemplate);
      COMMENT.commentActiveCheck(postId);
      COMMENT.commentDetail(postId);
    });
    COMMENT.commentDetail(postId);
  },
  showComment: function (postId, commentId) {
    const self = this;
    let preCommentId = commentId;
    let rootCommentId = "nested" + commentId;
    $("div#" + rootCommentId).empty();
    $.get(`/api/board/comment/${postId}/${preCommentId}`)
    .done(function (data) {
      data.forEach(function (element) {
        const commentId = element.id;
        const nickname = element.nickname;
        const content = element.content;
        const secondCommentId = "nested" + element.id;
        let div_str = `<div class="row" style="border-top: 1px solid darkgrey; background-color: lightgray;" id="${commentId}" >
                          <div style="text-align: left">↳</div>
                          <div class="col-" style="font-size: smaller; text-align: left; margin-top: 3px">닉네임 : ${nickname}</div>
                          <div class="col-9" style="text-align: left;">${content}</div>
                          <div class="md col-" style="text-align: right">
                                <button type="button" class="btn btn-secondary btn-sm" value="nestedCommentButton" name="${commentId}" data-bs-toggle="modal"
                            data-bs-target="#nestedCommentModal" data-groupId="${preCommentId}">답글</button>
                                <button type="button" class="btn btn-secondary btn-sm" value="commentModifyButton" name="${commentId}" data-bs-toggle="modal"
                          data-bs-target="#modifyModal" data-groupId="${preCommentId}">수정</button>
                                <button type="button" class="btn btn-primary btn-sm" value="commentDeleteButton" name="${commentId}" data-bs-toggle="modal"
                          data-bs-target="#passwordModal" data-groupId="${preCommentId}">삭제</button>
                          </div>
                          <div class="col" style="text-align: left; margin-bottom: 5px"></div>
                          <div id="${secondCommentId}" style="border-top: 1px solid darkgrey; background-color: darkgray; "></div>
                       </div>`;
        $("#" + rootCommentId).append(div_str);
        self.getComments(postId, commentId, function (commentTemplate) {
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
                  groupId: groupId,
                  nickname: $("#nestedCommentNicknameModal").val()
                })
            .done(function () {
              $("#nestedCommentContentModal").val('');
              $("#nestedCommentPasswordModal").val('');
              $("#nestedCommentNicknameModal").val('');
              nestedCommentModal.hide();
              if (COMMENT.options.commentActive.indexOf(groupId) === -1) {
                COMMENT.options.commentActive.push(groupId);
              }
              COMMENT.getRootComment(postId);
            });
          });
        });
    $("div.md > button[value|='commentDeleteButton']").off().on("click",
        function () {
          const commentID = $(this).attr('name');
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
              if (data === "true") {
                alert("삭제되었습니다.")
                passwordModal.hide();
                COMMENT.getRootComment(postId);
              } else if (data === "false") {
                $("#errorPassword").text("비밀번호가 일치하지 않습니다.");
              } else {
                alert(data);
                passwordModal.hide();
              }
            })
          })
        });
    $("div.md > button[value|='commentModifyButton']").off().on("click",
        function () {
          const commentID = $(this).attr('name');
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
                COMMENT.getRootComment(postId);
              } else {
                $("#errorCommentPassword").text("비밀번호가 일치하지 않습니다.");
              }
            })
          })
        });
    $("div.col > button[value|='showCommentButton']").off().on("click",
        function () {
          const commentId = $(this).attr('name');
          const rootCommentId = "nested" + commentId;
          self.showComment(postId, commentId, commentId);
          $("div#" + rootCommentId).toggle(function () {
            if (COMMENT.options.commentActive.indexOf(commentId) === -1) {
              COMMENT.options.commentActive.push(commentId);
            } else {
              const pos = COMMENT.options.commentActive.indexOf(commentId);
              COMMENT.options.commentActive.splice(pos, 1);
            }
          });
        }
    );
  },
  event: function (postId) {
    $("#commentButton").on("click", function () {
      $.post(`/api/board/comment`,
          {
            postId: postId,
            content: $("#content").val(),
            password: $("#commentPassword").val(),
            nickname: $("#nickname").val()
          })
      .done(function () {
        $("#content").val('');
        $("#commentPassword").val('');
        $("#nickname").val('');
        COMMENT.getRootComment(postId);
      });
    });
  },
  options: {
    commentActive: []
  },
  pagingOptions: {
    //func : COMMENT.getComments, //()붙이면 실행됨.
    pageNumber: 1,
    pageSize: 2,
    listSize: 3,
    pageName: 'COMMENT',
    postId: ''
  }
}
export default COMMENT;
