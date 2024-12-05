import express from 'express'
import { UserLoginRequest } from './user/UserLoginRequest'
import { UserMeRequest } from './user/UserMeRequest'
import { UserCreateRequest } from './user/UserCreateRequest'
import { UserUpdateRequest } from './user/UserUpdateRequest'
import { UserRemoveRequest } from './user/UserRemoveRequest'
import { UserUpdatePasswordRequest } from './user/UserUpdatePasswordRequest'
import { UserRecoverySendRequest } from './user/UserRecoverySendRequest'
import { UserRecoveryCodeRequest } from './user/UserRecoveryCodeRequest'
import { UserRecoveryChangePasswordRequest } from './user/UserRecoveryChangePasswordRequest'

export const UserRoute = express
    .Router()
    .post('/user/login', UserLoginRequest)
    .get('/user/me', UserMeRequest)
    .post('/user', UserCreateRequest)
    .put('/user', UserUpdateRequest)
    .delete('/user', UserRemoveRequest)
    .put('/user/password', UserUpdatePasswordRequest)
    .get('/user/recovery/send', UserRecoverySendRequest)
    .get('/user/recovery/code', UserRecoveryCodeRequest)
    .get('/user/recovery/updatePassword', UserRecoveryChangePasswordRequest)
