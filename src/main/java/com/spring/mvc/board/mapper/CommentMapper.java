package com.spring.mvc.board.mapper;

import com.spring.mvc.board.dto.Comment;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentMapper {

  void insertComment(@Param("comment") Comment comment);

  Comment findComment(@Param("id") int id);

  void updateCommentGroupId(@Param("id") int id);

  List<Comment> findAllComment(@Param("postId") int postId, @Param("parentId") int parentId,
      int startIdx, int listSize);

  int findNestedComment(@Param("comment") Comment comment);

  int findChildComment(@Param("id") int id);

  int findTotalCount(@Param("postId") int postId, @Param("parentId") int parentId);

  String findPwdById(@Param("id") int id);

  void updateComment(@Param("comment") Comment comment);

  void deleteComment(@Param("id") int id);
}
