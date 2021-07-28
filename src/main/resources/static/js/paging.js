import LIST from "./list.js";

const PAGING = {
  init: function () {
    const self = this;
    self.draw();
  },
  draw: function () {
    const self = this;
    const $pageUl = $("#pageUl");
    $pageUl.empty();
    if (self.variable.startPageNumber !== 1 && self.variable.endPageNumber
        === self.variable.totalPageNumber) {
      $pageUl.append(
          `<li class="page-item" value="1"><a class="page-link">맨 앞으로</a></li>`)
    }
    if (self.variable.startPageNumber !== 1) {
      $pageUl.append(
          `<li class="page-item" value="${self.variable.startPageNumber
          - 1}"><a class="page-link">이전</a></li>`)
    }
    for (let idx = self.variable.startPageNumber;
        idx <= self.variable.endPageNumber; idx++) {
      let li_str;
      if (idx === self.options.pageNumber) {
        li_str = `<li class="page-item active" aria-current="page" value="${idx}"><a class="page-link">${idx}</a></li>`;
      } else {
        li_str = `<li class="page-item" value="${idx}"><a class="page-link">${idx}</a></li>`;
      }
      $pageUl.append(li_str);
    }
    if (self.variable.endPageNumber !== self.variable.totalPageNumber) {
      $pageUl.append(
          `<li class="page-item" value="${self.variable.endPageNumber
          + 1}"><a class="page-link">다음</a></li>`)
    }
    if (self.variable.startPageNumber === 1 && self.variable.endPageNumber
        !== self.variable.totalPageNumber) {
      $pageUl.append(
          `<li class="page-item" value="${self.variable.totalPageNumber}"><a class="page-link">맨끝으로</a></li>`)
    }
    self.event();
  },
  setStartEndPage: function () {
    const self = this;
    let selfOptions = this.options;
    let totalNumber = Math.floor(
        selfOptions.totalCount / selfOptions.listSize);
    if (selfOptions.totalCount % selfOptions.listSize > 0) {
      totalNumber += 1;
    }
    self.variable.totalPageNumber = totalNumber;
    let startNumber = Math.floor(
        selfOptions.pageNumber / selfOptions.pageSize)
        * selfOptions.pageSize + 1;
    if (selfOptions.pageNumber % selfOptions.pageSize === 0) {
      startNumber = selfOptions.pageNumber - selfOptions.pageSize + 1;
    }
    self.variable.startPageNumber = startNumber;

    let endNumber = Math.floor(
        selfOptions.pageNumber / selfOptions.pageSize + 1)
        * selfOptions.pageSize;
    if (selfOptions.pageNumber % selfOptions.pageSize === 0) {
      endNumber = selfOptions.pageNumber;
    }
    if (this.variable.totalPageNumber < endNumber) {
      endNumber = this.variable.totalPageNumber;
    }
    self.variable.endPageNumber = endNumber;
  },
  event: function () {
    $("#pageUl > ").off().on("click", function () {
      if (PAGING.options.pageName === 'LIST') { // PAGING.options.pageName 을 모듈이름으로 사용할 수 있는지?
        LIST.pagingOptions.pageNumber = $(this).val();
        LIST.init();
      }
    });
  },
  options: {
    pageNumber: '',
    totalCount: '',
    pageSize: '',
    listSize: '',
    pageName: ''
  },
  variable: {
    startPageNumber: '',
    endPageNumber: '',
    totalPageNumber: ''
  },
}
export default PAGING;
