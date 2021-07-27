package com.spring.mvc.board.controller;

import com.spring.mvc.board.dto.Comment;
import com.spring.mvc.board.service.CommentService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/board/comment")
@RestController
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;

  @GetMapping()
  public Comment searchOne(int id) {
    return commentService.find(id);
  }

  @GetMapping("/{postId}/{parentId}")
  public List<Comment> searchAll(@PathVariable int postId, @PathVariable int parentId) {
    return commentService.findAll(postId, parentId);
  }

  @PostMapping()
  public void register(Comment comment) {
    commentService.register(comment);
  }

  @DeleteMapping
  public String delete(int id, String password) {
    return commentService.delete(id, password);
  }

  @PutMapping
  public Boolean modify(Comment comment) {
    return commentService.modify(comment);
  }
}
