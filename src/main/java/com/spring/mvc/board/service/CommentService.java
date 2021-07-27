package com.spring.mvc.board.service;

import com.spring.mvc.board.dto.Comment;
import com.spring.mvc.board.mapper.CommentMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentService {

  private final CommentMapper commentMapper;
  private final PasswordEncoder passwordEncoder;

  public void register(Comment comment) {
    comment.setPassword(passwordEncoder.encode(comment.getPassword()));
    commentMapper.insertComment(comment);
    int insertId = comment.getId();
    if (commentMapper.findComment(insertId).getParentId() == 0) {
      commentMapper.updateCommentGroupId(insertId);
    }
  }

  public Comment find(int id) {
    return commentMapper.findComment(id);
  }

  public List<Comment> findAll(int postId, Comment comment) {
    comment.setPostId(postId);
    List<Comment> comments = commentMapper.findAllComment(comment);
    for (Comment c : comments) {
      c.setCommentCnt(commentMapper.findNestedComment(c) - 1); //count subquery로 수행
    }
    return comments;
  }

  public Boolean modify(Comment comment) {
    if (Boolean.TRUE.equals(checkPwd(comment.getId(), comment.getPassword()))) {
      commentMapper.updateComment(comment);
      return true;
    } else {
      return false;
    }
  }

  public String delete(int id, String password) {
    if (Boolean.TRUE.equals(checkPwd(id, password))) {
      if (commentMapper.findChildComment(id) != 0) {
        return "답글이 존재하여, 해당 댓글을 삭제할 수 없습니다.";
      } else {
        commentMapper.deleteComment(id);
        return "true";
      }
    } else {
      return "false";
    }
  }

  public Boolean checkPwd(int id, String password) {
    return passwordEncoder.matches(password, commentMapper.findPwdById(id));
  }
}
