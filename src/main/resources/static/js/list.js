import PAGING from "./paging.js";
import DETAIL from "./detail.js";
import REGISTER from "./register.js";
import COMMENT from "./comment.js";

const LIST = {
  init: function () {
    const self = this;
    const $app = $("#app");
    $("body").removeClass("modal-open").removeAttr("style");
    const template = `<h2 style="text-align: center; margin-top: 30px">게시판</h2>
                        <div class="input-group mb-3"
                             style="width: 600px; margin-left: auto; margin-right: auto;margin-top: 30px">
                          <select class="form-select form-select-sm " aria-label=".form-select-sm" name="postItem"
                                  id="postItem">
                            <option value="postAll">전체</option>
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                          </select>
                          <input type="text" class="form-control" placeholder="검색어를 입력해주세요." name="postItemValue"
                                 aria-label="inputSearch" id="postItemValue">
                          <button class="btn btn-outline-secondary" type="button" id="searchButton">검색</button>
                          <button class="btn btn-outline-secondary" type="button" id="searchAllButton">전체검색</button>
                        </div>
                      <div class="container" style="margin-top: 30px; margin-left: auto; margin-right: auto;">
                        <div class="row">
                          <div class="col">
                            번호
                          </div>
                          <div class="col-6">
                            제목
                          </div>
                          <div class="col">
                            업데이트 날짜
                          </div>
                        </div>
                      </div>
                      <button type="button" class="btn btn-secondary"
                              style="margin-top: 20px; margin-left: 20px; margin-bottom: 5%" id="registerButton">등록
                      </button>
                      <nav aria-label="pagination" id="pageNav">
                      <ul class="pagination justify-content-center" id="pageUl"></ul>
                      </nav>`;
    $app.empty();
    $app.append(template);
    $("#postItem").val(self.params.postItem);
    $("#postItemValue").val(self.params.postItemValue);
    self.event();
    LIST.getPosts(self.pagingOptions.pageNumber);
  },
  getPostCount: function () {
    $.get('/api/board/totalCount', {
      "postItem": $("#postItem").val(),
      "postItemValue": $("#postItemValue").val()
    }).done(function (data) {
      LIST.pagingOptions.totalCount = data;
    })
  },
  getPosts: function (pageNumber) {
    const self = this;
    LIST.pagingOptions.pageNumber = pageNumber;
    LIST.pagingOptions.func = self.getPosts;
    LIST.getPostCount();
    $.get('/api/board', {
      "postItem": $("#postItem").val(),
      "postItemValue": $("#postItemValue").val(),
      "startIdx": (LIST.pagingOptions.pageNumber - 1)
          * LIST.pagingOptions.listSize,
      "listSize": LIST.pagingOptions.listSize
    })
    .done(
        function (data) {
          const len = data.length;
          $("div.container > div.row:nth-child(n+2)").remove();
          if (len === 0) {
            let div_str = `<div class=\"row\">
                         <p> <br> 검색된 내용이 없습니다.</p>
                         </div>`;
            $("div.container").append(div_str);
          }
          data.forEach(function (element) {
            const postId = element.postId;
            const title = element.title;
            const updateDate = element.updateDate.substring(0, 10);
            const div_str = `<div class="row">
                              <div class="col">${postId}</div>
                              <div class="col-6">${title}</div>
                              <div class="col">${updateDate}</div>
                             </div>`;
            $("div.container").append(div_str);
          });
          PAGING.init(LIST.pagingOptions);
          LIST.detail();
        });
  },
  detail: function () {
    $("div.container > div.row:gt(0)").off().click(function () {
      COMMENT.pagingOptions.pageNumber = 1;
      DETAIL.init($(this).find("div.col:first-child").text());
    })
  },
  event: function () {
    const self = this;
    $("#searchButton").on("click", function () {
      $("div.container > div.row:gt(0)").remove();
      self.params.postItem = $("#postItem").val();
      self.params.postItemValue = $("#postItemValue").val();
      LIST.pagingOptions.pageNumber = 1;
      self.getPosts(self.pagingOptions.pageNumber);
    });
    $("#searchAllButton").on("click", function () {
      $("div.container > div.row:gt(0)").remove();
      $("#postItem").val("postAll");
      $("#postItemValue").val("");
      LIST.pagingOptions.pageNumber = 1;
      self.params.postItem = 'postAll';
      self.params.postItemValue = '';
      self.getPosts(self.pagingOptions.pageNumber);
    });
    $("#registerButton").on("click", function () {
      REGISTER.init();
    });
  },
  params: {
    postItem: 'postAll',
    postItemValue: '',
  },
  pagingOptions: {
    pageNumber: 1,
    totalCount: '',
    pageSize: 3,
    listSize: 5,
    pageName: 'LIST',
    func: function () {
    },
  }
}

LIST.init()
export default LIST;

