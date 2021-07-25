package com.spring.mvc.board.service;

import com.spring.mvc.board.dto.Post;
import com.spring.mvc.board.dto.Search;
import com.spring.mvc.board.mapper.PostMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

  private final PostMapper postMapper;
  private final PasswordEncoder passwordEncoder;

  public void register(Post post) {
    post.setPassword(passwordEncoder.encode(post.getPassword()));
    postMapper.insertPost(post);
  }

  public Boolean modify(Post post) {
    if (Boolean.TRUE.equals(checkPwd(post.getPostId(), post.getPassword()))) {
      postMapper.updatePost(post);
      return true;
    } else {
      return false;
    }
  }

  public Boolean delete(Post post) {
    if (Boolean.TRUE.equals(checkPwd(post.getPostId(), post.getPassword()))) {
      postMapper.deletePost(post);
      return true;
    } else {
      return false;
    }
  }

  public List<Post> find(Search search) {
    return postMapper.findPost(search);
  }

  public Post detail(int postId) {
    return postMapper.findByPostId(postId);
  }

  public Boolean checkPwd(int postId, String password) {
    return passwordEncoder.matches(password, postMapper.findPwdByPostId(postId));
  }
}
