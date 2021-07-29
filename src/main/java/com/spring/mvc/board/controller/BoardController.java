package com.spring.mvc.board.controller;

import com.spring.mvc.board.dto.Post;
import com.spring.mvc.board.dto.Search;
import com.spring.mvc.board.service.PostService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/board")
public class BoardController {

  private final PostService postService;


  @GetMapping
  public List<Post> search(Search search, int startIdx, int listSize) {
    return postService.find(search, startIdx, listSize);
  }

  @GetMapping("/{postId}")
  public Post detail(@PathVariable int postId) {
    return postService.detail(postId);
  }

  @GetMapping("/checkPwd")
  public Boolean checkPwd(int postId, String password) {
    return postService.checkPwd(postId, password);
  }

  @GetMapping("/totalCount")
  public int totalCount(Search search) {
    return postService.totalCount(search);
  }

  @PostMapping
  public void register(Post post) {
    postService.register(post);
  }

  @PutMapping
  public Boolean modify(Post post) {
    return postService.modify(post);
  }

  @DeleteMapping
  public Boolean delete(Post post) {
    return postService.delete(post);
  }

}
