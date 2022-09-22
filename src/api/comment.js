import request from '@/utils/request'

// 评论请求模块

// 获取文章评论列表
export const getComments = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

// 对评论点赞
export const addCommentLike = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: target
  })
}

// 对评论点赞
export const deleteCommentLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

// 添加文章评论或评论回复
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
