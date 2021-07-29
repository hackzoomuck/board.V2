package com.spring.mvc.board.mapper;

import com.spring.mvc.board.dto.Post;
import com.spring.mvc.board.dto.Search;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {

  List<Post> findPost(@Param("search") Search search, @Param("startIdx") int startIdx,
      @Param("listSize") int listSize);

  Post findByPostId(@Param("postId") int postId);

  String findPwdByPostId(@Param("postId") int postId);

  int findTotalCount(@Param("search") Search search);

  void insertPost(@Param("post") Post post);

  void updatePost(@Param("post") Post post);

  void deletePost(@Param("postId") int postId);
}
