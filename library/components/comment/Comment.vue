<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, shallowRef } from 'vue';
import { JSONContent } from '@tiptap/vue-3';
import { CommentServices } from 'lib/services/comment.service';
import { getNestedProperyValue } from 'lib/utils';
import {
  CommentProps,
  CommentData,
  NewCommentResponse,
  UpdatedCommentReponse,
  CommentsReactionResponse,
} from './Comment.vue.d';
import { GetMentionSuggestionResponse } from '../editor/Editor.vue.d';

import Image from '../image/Image.vue';
import InputText from '../inputtext/InputText.vue';
import Editor from '../editor/Editor.vue';
import CommentBlock from './CommentBlock.vue';
import Skeleton from 'primevue/skeleton';
import Button from '../button/Button.vue';

onMounted(() => {
  joinRoom();
  fetchGetComments();
});

onUnmounted(() => {
  leaveRoom();
});

const props = withDefaults(defineProps<CommentProps>(), {});
const editorVisibility = shallowRef(true);
const editorData = ref<JSONContent>();
const commentsList = reactive<CommentData[]>([]);
const isLoading = shallowRef<boolean>(true);
const mentionSuggestionList = shallowRef<GetMentionSuggestionResponse>();
const mentionedList = ref();

const setEditorVisibility = (): void => {
  editorVisibility.value = !editorVisibility.value;
};

const fetchGetComments = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const { data } = await CommentServices.getCommentsByObjectId(
      props.objectId,
    );
    commentsList.push(...data.data);
    isLoading.value = false;
  } catch (error) {
    console.error(error);
    isLoading.value = false;
  }
};

const postComment = async (): Promise<void> => {
  try {
    await CommentServices.postComments({
      content: editorData.value ?? {},
      objectId: props.objectId,
      type: props.commentType,
    });
    setEditorVisibility();
    editorData.value = [];
  } catch (error) {
    console.error(error);
  }
};

const socket = CommentServices.commentSocketIo();

const joinRoom = (): void => {
  socket.on('connect', () => {
    socket.emit('joinRoom', `${props.commentType}_${props.objectId}`);
    listenNewMessage();
    listenUpdatedMessage();
    listenReactionUpdatedMessage();
  });
};

const listenNewMessage = (): void => {
  socket.on('newComment', (data: NewCommentResponse) => {
    const indexComments = commentsList.findIndex(
      (comment) => comment._id === data.replyToId,
    );
    if (indexComments >= 0) {
      commentsList[indexComments].replies.push({
        ...data,
      });
    } else {
      commentsList.push({
        ...data,
        replies: [],
      });
    }
  });
};

const listenUpdatedMessage = (): void => {
  socket.on('commentUpdated', updateEditedMessage);
};

const listenReactionUpdatedMessage = (): void => {
  socket.on('reactionUpdated', updateReactionMesage);
};

const updateReactionMesage = (data: CommentsReactionResponse): void => {
  const indexComments = commentsList.findIndex(
    (comment) => comment._id === data._id,
  );

  if (indexComments >= 0) {
    commentsList[indexComments].reactions = data.reactions;
  } else {
    commentsList.forEach((comment, index) => {
      const indexReplies = comment.replies.findIndex(
        (replies) => replies._id === data._id,
      );

      if (indexReplies >= 0) {
        commentsList[index].replies[indexReplies].reactions = data.reactions;
      }
    });
  }
};

const updateEditedMessage = (data: UpdatedCommentReponse): void => {
  const indexComments = commentsList.findIndex(
    (comment) => comment._id === data._id,
  );

  if (indexComments >= 0) {
    commentsList[indexComments].content = data.content;
  } else {
    commentsList.forEach((comment, index) => {
      const indexReplies = comment.replies.findIndex(
        (replies) => replies._id === data._id,
      );

      if (indexReplies >= 0) {
        commentsList[index].replies[indexReplies].content = data.content;
      }
    });
  }
};

const leaveRoom = (): void => {
  socket.emit('leaveRoom');
};

const fetchMentionSuggestionFunction = async (): Promise<
  GetMentionSuggestionResponse | undefined
> => {
  if (mentionSuggestionList.value === undefined) {
    try {
      const { data } = await CommentServices.getCommentsMention({
        objectID: props.objectId,
        type: props.commentType,
      });
      mentionSuggestionList.value = data;
    } catch (error) {
      console.error(error);
    }
  }
  return mentionSuggestionList.value;
};
</script>

<template>
  <div class="flex gap-1 items-start">
    <Image
      :src="getNestedProperyValue(user, 'profilePicture') as string"
      @click.stop=""
      class="w-[30px] h-[30px]"
      rounded
    />

    <div class="w-full">
      <InputText
        v-if="editorVisibility"
        @click.stop="setEditorVisibility"
        placeholder="Tulis Komentar"
      />

      <Editor
        v-else
        v-model:mentioned-list="mentionedList"
        v-model:model-value="editorData"
        :fetch-mention-suggestion-function="fetchMentionSuggestionFunction"
        placeholder="Tulis Komentar"
      />

      <div v-if="!editorVisibility" class="mt-2 flex gap-1">
        <Button @click="postComment" label="Kirim" severity="success" />

        <Button
          @click="setEditorVisibility"
          label="Batal"
          severity="secondary"
          text
        />
      </div>
    </div>
  </div>

  <div v-if="!isLoading">
    <CommentBlock
      :key="comment._id"
      v-for="comment in commentsList"
      v-bind="comment"
      :comment-type="props.commentType"
      :fetch-mention-suggestion-function="fetchMentionSuggestionFunction"
      :user="props.user"
    />
  </div>

  <div v-else>
    <div class="flex gap-1 items-center">
      <Skeleton shape="circle" size="2rem" />
      <Skeleton height="1rem" width="10rem" />
    </div>

    <Skeleton class="ml-[34px]" height="4rem" width="10rem" />
  </div>
</template>
