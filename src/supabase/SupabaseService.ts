import type { AuthResponse, User } from '@supabase/supabase-js'
import { supabase } from './client'

type TableRow = Record<string, unknown>

export type ProductRow = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
}

export class SupabaseService {
  async signUp(email: string, password: string, metadata?: TableRow): Promise<AuthResponse> {
    return supabase.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    })
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async signOut(): Promise<{ error: Error | null }> {
    return supabase.auth.signOut()
  }

  async getCurrentUser(): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await supabase.auth.getUser()
    return { user: data.user, error }
  }

  async getRows<T extends TableRow = TableRow>(table: string): Promise<{ data: T[] | null; error: Error | null }> {
    const { data, error } = await supabase.from(table).select('*')
    return { data: data as T[] | null, error }
  }

  async getProducts(): Promise<{ data: ProductRow[] | null; error: Error | null }> {
    return this.getRows<ProductRow>('Products')
  }

  async getRow<T extends TableRow = TableRow>(table: string, column: string, value: unknown): Promise<{ data: T | null; error: Error | null }> {
    const { data, error } = await supabase.from(table).select('*').eq(column, value).maybeSingle()
    return { data: data as T | null, error }
  }

  async insertRow<T extends TableRow = TableRow>(table: string, row: T): Promise<{ data: T | null; error: Error | null }> {
    const { data, error } = await supabase.from(table).insert(row).select().single()
    return { data: data as T | null, error }
  }

  async updateRow<T extends TableRow = TableRow>(table: string, column: string, value: unknown, changes: Partial<T>): Promise<{ data: T | null; error: Error | null }> {
    const { data, error } = await supabase.from(table).update(changes as never).eq(column, value).select().single()
    return { data: data as T | null, error }
  }

  async deleteRow(table: string, column: string, value: unknown): Promise<{ error: Error | null }> {
    const { error } = await supabase.from(table).delete().eq(column, value)
    return { error }
  }
}

export const supabaseService = new SupabaseService()
