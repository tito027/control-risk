import { store } from "@/store"
import { Action, getModule, Module, Mutation } from "vuex-module-decorators"
import axios from "axios"
import { env } from "@/config"
import Master from "@/store/modules/master"
import { AuthModule } from "@/store/modules/Auth"
import ApiGateway from "@/store/api"
import {  PsychicDocument } from 'control-risk/schemas/psychic.schema';
import {  AnswerDocument } from 'control-risk/schemas/answers.schema';

import { AgentsModule } from "./Agents"
export interface UsersTest {
  test:PsychicDocument,
  user: {
    carnet: string,
    username: string,
    _id: string
  },
  createdBy: {
    carnet: string,
    username: string,
    _id: string
  },
  createdAt: string
  _id: string

}
interface aws extends AnswerDocument{
  createdAt:string
}
@Module({ dynamic: true, namespaced: true, name: "Test", store })
export class Test extends Master {
optionsData: any[] = []
  _test: PsychicDocument[] | undefined = undefined;
  _Usertest: UsersTest[] | undefined = undefined;
  openModal: boolean = false;
  openOverview: boolean = false;
  document: PsychicDocument | undefined = undefined;
  answerOverview: aws | undefined = undefined;
  loading: boolean = false;

  // ***************************************** MUTATIONS *****************************************
  @Mutation
  setOptionsData(data: any[]) {
    this.optionsData = data
  }
  @Mutation
  setTestList(value: PsychicDocument[]) {
    this._test = value
  }
  @Mutation
  setUserTestList(value: UsersTest[]) {
    this._Usertest = value
  }
  @Mutation
  setOpenModal(value: boolean) {
    this.openModal = value
  }
  @Mutation
  setDocument(value: PsychicDocument | undefined) {
    this.document = value
  }
  @Mutation
  setDocumentById(_id: string ) {
    this.document = this._test?.find(x=>x._id === _id);
  }
  @Mutation
  setOverviewOpenModal(value: boolean) {
    this.openOverview = value
  }
  @Mutation
  setAnswerOverview(value: aws) {
    this.answerOverview = value
  }
  @Mutation
  setLoading(value: boolean) {
    this.loading = value
  }
  // ***************************************** GETS *****************************************
  get getOptionsData() {
    return this.optionsData
  }
  get getTestsList() {
    return this._test
  }
  get getUserTestsList() {
    return this._Usertest
  }
  get getOpenModal() {
    return this.openModal
  }
  get getDocument() {
    return this.document
  }
  get getOverviewOpenModal() {
    return this.openOverview
  }
  get getAnswerOverview() {
    return this.answerOverview
  }
  get getLoading() {
    return this.loading
  }
  // ***************************************** ACTIONS *****************************************
  @Action
  async createAgent(data: any) {
    return await this.handleRequest({
      request: ApiGateway.post("/agents/create", data),
    })
  }
    @Action
  async pullTest() {
    const { reply, success }  = await this.handleRequest({
      request: ApiGateway.post("psychic/find-list", {user: AuthModule.id},
      ),
    })
    if (!success) return
    this.setTestList(reply.data);
    return { reply, success }

  }

  @Action
  async pullUserTest() {
    const { reply, success }  = await this.handleRequest({
      request: ApiGateway.post("psychic/find/answers/user", {user: AuthModule.id,userAnswer: AgentsModule.getAgentOverview?._id},
      ),
    })
    if (!success) return
    this.setUserTestList(reply.data);
    return { reply, success }

  }

  @Action
  async pullAnswerById(answerID:string) {
    const { reply, success }  = await this.handleRequest({
      request: ApiGateway.post("psychic/find/answers/id", {answerID},
      ),
    })
    if (!success) return
    this.setAnswerOverview(reply.data);
    return { reply, success }

  }
}

export const TestModule = getModule(Test)
