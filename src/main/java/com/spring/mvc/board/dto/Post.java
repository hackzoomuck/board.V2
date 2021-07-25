package com.spring.mvc.board.dto;

import java.sql.Timestamp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Post {

  private String title;
  private String content;
  private int postId;
  private boolean deleteWhether;
  private String password;
  private Timestamp updateDate;
}

