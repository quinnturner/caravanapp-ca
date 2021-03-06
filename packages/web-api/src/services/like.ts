import type { Types } from 'mongoose';

import { FilterMongooseDocKeys, LikesDoc, LikesModel } from '@caravanapp/mongo';

export const getPostLikes = async (postId: Types.ObjectId) => {
  const likesDoc = await LikesModel.findOne({ postId: postId });
  return likesDoc;
};

export const getPostsLikes = async (postIds: Types.ObjectId[]) => {
  const likesDocs = await LikesModel.find({
    postId: { $in: postIds },
  });
  return likesDocs;
};

export const createLikesDoc = async (postId: Types.ObjectId) => {
  const likesObj: FilterMongooseDocKeys<LikesDoc> = {
    postId,
    likes: [],
    numLikes: 0,
  };
  return LikesModel.create(likesObj);
};

export async function deleteLikesDocByPostId(postId: string) {
  const likesDoc = await LikesModel.findOneAndDelete({ postId });
  return likesDoc || undefined;
}
