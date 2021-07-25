package com.spring.mvc.board.mapper;

import com.spring.mvc.board.dto.Post;
import com.spring.mvc.board.dto.Search;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {

  List<Post> findPost(@Param("search") Search search);

  Post findByPostId(@Param("postId") int postId);

  String findPwdByPostId(@Param("postId") int postId);

  void insertPost(@Param("post") Post post);

  void updatePost(@Param("post") Post post);

  void deletePost(@Param("post") Post post);
}
