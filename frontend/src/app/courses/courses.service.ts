import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private http = inject(HttpClient);

  // Course CRUD
  getCoursesMeta(course_code: string) {
    if (course_code) {
      return this.http.get<{ success: boolean; data: ICoursesMeta }>(
        environment.HTTP_SERVER + `/api/courses/meta?course_code=${course_code}`
      );
    } else {
      return this.http.get<{ success: boolean; data: ICoursesMeta }>(
        environment.HTTP_SERVER + `/api/courses/meta`
      );
    }
  }

  getCoursesBySearch(text: string){
   return this.http.get<{ success: boolean; data: ICourse[] }>(
     environment.HTTP_SERVER + `/api/courses/search?text=${text}`
   );
  }

  getCoursesCount() {
    return this.http.get<{ success: boolean; data: number }>(
      environment.HTTP_SERVER + `/api/courses/count`
    );
  }

  getCourses(page_number: number, page_size: number, course_code: string) {
    if (course_code) {
      return this.http.get<{ success: boolean; data: ICourse[] }>(
        environment.HTTP_SERVER +
          `/api/courses?page_number=${page_number}&limit=${page_size}&course_code=${course_code}`
      );
    } else {
      return this.http.get<{ success: boolean; data: ICourse[] }>(
        environment.HTTP_SERVER +
          `/api/courses?page_number=${page_number}&limit=${page_size}`
      );
    }
  }
  addCourse(course: ICourse) {
    return this.http.post<{ success: boolean; data: any }>(
      environment.HTTP_SERVER + '/api/courses',
      course
    );
  }
  removeCourse(course_id: string) {
    return this.http.delete<{ success: boolean; data: any }>(
      environment.HTTP_SERVER + '/api/courses/' + course_id
    );
  }
  updateCourse(course: ICourse) {
    return this.http.patch<{ success: boolean; data: any }>(
      environment.HTTP_SERVER + '/api/courses/' + course._id,
      course
    );
  }
  getCourseById(course_id: string) {
    return this.http.get<{ success: boolean; data: ICourse }>(
      environment.HTTP_SERVER + '/api/courses/' + course_id
    );
  }

  // Question CRUD
  getQuestions(course_id: string) {
    return this.http.get<{ success: boolean; data: IQuestion[] }>(
      environment.HTTP_SERVER + `/api/courses/${course_id}/questions`
    );
  }
  getQuestionsOrderBy(
    course_id: string,
    order_by: string,
    page_number: number,
    page_size: number,
    text: string
  ) {
    if (text) {
      return this.http.get<{ success: boolean; data: IQuestion[] }>(
        environment.HTTP_SERVER +
          `/api/courses/${course_id}/questions/order_by?order_by=${order_by}&page_number=${page_number}&limit=${page_size}&text=${text}`
      );
    } else {
      return this.http.get<{ success: boolean; data: IQuestion[] }>(
        environment.HTTP_SERVER +
          `/api/courses/${course_id}/questions/order_by?order_by=${order_by}&page_number=${page_number}&limit=${page_size}`
      );
    }
  }
  getQuestionById(course_id: string, question_id: string) {
    return this.http.get<{ success: boolean; data: IQuestion }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}`
    );
  }

  removeQuestion(course_id: string, question_id: string) {
    return this.http.delete<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}`
    );
  }
  addQuestion(course_id: string, question: IQuestion) {
    console.log(question);
    return this.http.post<{ success: boolean; data: any }>(
      environment.HTTP_SERVER + `/api/courses/${course_id}/questions`,
      question
    );
  }
  updateQuestion(course_id: string, question: IQuestion) {
    return this.http.patch<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question._id}`,
      question
    );
  }

  // Comment CRUD
  addComment(course_d: string, question_id: string, comment: IComment) {
    return this.http.post<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_d}/questions/${question_id}/comments`,
      comment
    );
  }
  removeComment(course_id: string, question_id: string, comment_id: string) {
    return this.http.delete<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/comments/${comment_id}`
    );
  }

  // Question Reaction CRUD
  getQuestionReactionsCount(course_id: string, question_id: string) {
    return this.http.get<{ success: boolean; data: IReactionsCount }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/reactions/count`
    );
  }
  addQuestionReaction(
    course_id: string,
    question_id: string,
    reaction: IReaction
  ) {
    return this.http.post<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/reactions`,
      reaction
    );
  }
  removeQuestionReaction(
    course_id: string,
    question_id: string,
    reaction_id: string
  ) {
    return this.http.delete<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/reactions/${reaction_id}`
    );
  }
  removeQuestionReactionByUserId(course_id: string, question_id: string) {
    return this.http.delete<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/reactions/delete/by_user`
    );
  }
  updateQuestionReaction(
    course_id: string,
    question_id: string,
    reaction_id: string,
    reaction: IReaction
  ) {
    return this.http.patch<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/reactions/${reaction_id}`,
      reaction
    );
  }
  updateQuestionReactionByUserId(
    course_id: string,
    question_id: string,
    reaction: IReaction
  ) {
    return this.http.patch<{ success: boolean; data: any }>(
      environment.HTTP_SERVER +
        `/api/courses/${course_id}/questions/${question_id}/reactions/update/by_user`,
      reaction
    );
  }
}

// Interfaces for Course

export interface IReaction {
  _id: string;
  type: 'up' | 'down';
  user: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IComment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
  };
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IReactionsCount {
  total: number;
  up: number;
  down: number;
  user_reaction: string;
}

export interface IQuestion {
  _id: string;
  text: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  user: {
    _id: string;
    name: string;
  };
  reactions: IReaction[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourse {
  _id: string;
  course_code: string;
  title: string;
  instructor: string;
  term: string;
  description: string;
  user: {
    _id: string;
    name: string;
  };
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICoursesMeta {
  courses_count: number;
  course_codes: string[];
  instructors: string[];
}
