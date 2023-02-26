type Service =
  // no_db
  | "get og"
  // user_db
  | "add username"
  | "get user"
  | "get users" //
  | "login"
  | "oauth"
  | "register"
  | "update avatar"
  // post_db
  | "create post"
  | "delete post" //
  | "get post" //
  | "get posts"
  | "get user posts" //
  | "update post" //
  // friend_db
  | "add friend" //
  | "delete friend" //
  | "get friends" //
  | "get friend requests" //
  // notification_db
  | "get notifications" //
  | "mark notifications as read" //
  // comment_db
  | "create comment" //
  | "delete comment" //
  | "get comments" //
  | "update comment" //
  // subcomment_db
  | "create subcomment" //
  | "delete subcomment" //
  | "get subcomments" //
  | "update subcomment" //
  // like_db
  | "create like" //
  | "delete like" //
  | "get likes" //
  // share_db
  | "create share" //
  | "delete share" //
  | "get shares" //
  // message_db
  | "create message" //
  | "delete message" //
  | "get user messages" //
  | "get messages"; //

export default Service;
