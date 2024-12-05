import { DatabaseEntity } from './database/DatabaseEntity'

export type UserType = DatabaseEntity<{
    picture?: string
    full_name?: string
    email?: string
    person_type?: 'PF' | 'PJ'
    document_type?: 'RG' | 'CPF' | 'CNPJ'
    document_number?: string
    password?: string
    biography?: string
    phone?: string
    birthday?: Date
    address: {
        zip_code?: string
        street_name?: string
        street_number?: string
        complement?: string
        neighborhood?: string
        city?: string
        state?: string
        country?: string
    }
    settings: {
        color_schema?: string
    }
}>
