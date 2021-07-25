package com.spring.mvc.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

  private int id;
  private int postId;
  private String content;
  private int parentId;
  private int groupId;
  private String password;
  private String nickname;
  private boolean deleteWhether;
}

