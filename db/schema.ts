import {sqliteTable,text,integer,index} from "drizzle-orm/sqlite-core";
export const plans=sqliteTable("plans",{id:text("id").primaryKey(),data:text("data").notNull(),revision:integer("revision").notNull(),updatedAt:text("updated_at").notNull()});
export const users=sqliteTable('users',{id:text('id').primaryKey(),email:text('email').notNull().unique(),name:text('name').notNull(),passwordHash:text('password_hash').notNull(),createdAt:integer('created_at').notNull()});
export const sessions=sqliteTable('sessions',{tokenHash:text('token_hash').primaryKey(),userId:text('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}),expiresAt:integer('expires_at').notNull(),createdAt:integer('created_at').notNull()},t=>[index('sessions_user_idx').on(t.userId),index('sessions_expiry_idx').on(t.expiresAt)]);
export const authLimits=sqliteTable('auth_limits',{key:text('key').primaryKey(),attempts:integer('attempts').notNull(),expiresAt:integer('expires_at').notNull()},t=>[index('auth_limits_expiry_idx').on(t.expiresAt)]);

