package com.spring.mvc.board.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ResultPost {

  private List<Post> data;
  private int totalCount;
}
