import api from '../../../lib/axios';
import type {
	ContactIdPayload,
	CreateContactPayload,
	UpdateContactPayload
} from '../_model/payload';
import type { ContactDetailResponse, EmptyContactResponse } from '../_model/response';

export const createContact = async (payload: CreateContactPayload): Promise<EmptyContactResponse> =>
	(await api.post<EmptyContactResponse>('/contact/create', payload)).data;
export const getContactDetail = async (): Promise<ContactDetailResponse> =>
	(await api.post<ContactDetailResponse>('/contact/active', {})).data;
export const getActiveContact = async (): Promise<ContactDetailResponse> =>
	(await api.post<ContactDetailResponse>('/contact/active', {})).data;
export const updateContact = async (payload: UpdateContactPayload): Promise<EmptyContactResponse> =>
	(await api.post<EmptyContactResponse>('/contact/update', payload)).data;
export const activateContact = async (payload: ContactIdPayload): Promise<EmptyContactResponse> =>
	(await api.post<EmptyContactResponse>('/contact/activate', payload)).data;
export const deleteContact = async (payload: ContactIdPayload): Promise<EmptyContactResponse> =>
	(await api.post<EmptyContactResponse>('/contact/delete', payload)).data;
