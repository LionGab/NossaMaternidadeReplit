import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log("🚀 Iniciando setup do banco de dados...\n");

    const sqlPath = path.join(__dirname, "supabase-setup.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Split SQL into individual statements
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Executando ${statements.length} comandos SQL...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          const { error } = await supabase.rpc("exec_sql", { sql: statement });
          if (error) {
            console.error(`❌ Erro no comando ${i + 1}:`, error.message);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.error(`❌ Erro inesperado no comando ${i + 1}:`, err);
        }
      }
    }

    console.log("\n✨ Setup do banco de dados concluído!");
  } catch (error) {
    console.error("❌ Erro ao configurar banco:", error);
  }
}

setupDatabase();
