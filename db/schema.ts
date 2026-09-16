import {sqliteTable,text,integer} from "drizzle-orm/sqlite-core";
export const plans=sqliteTable("plans",{id:text("id").primaryKey(),data:text("data").notNull(),revision:integer("revision").notNull(),updatedAt:text("updated_at").notNull()});

