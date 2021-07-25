package com.spring.mvc.board.mapper;

import com.spring.mvc.board.dto.Comment;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentMapper {

  void insertComment(@Param("comment") Comment comment);

  Comment findComment(@Param("id") int id);

  List<Comment> findAllComment(@Param("comment") Comment comment);

  int findNestedComment(@Param("comment") Comment comment);

  String findPwdById(@Param("id") int id);

  void updateComment(@Param("comment") Comment comment);

  void deleteComment(@Param("id") int id);
}