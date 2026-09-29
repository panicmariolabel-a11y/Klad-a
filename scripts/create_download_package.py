import os
import zipfile

def create_package():
    os.makedirs('public/download', exist_ok=True)
    zip_path = 'public/download/kvota2-heroji-aplikacija.zip'
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        # 1. Add dist files to the root of the zip for instant hosting
        dist_dir = 'dist'
        if os.path.exists(dist_dir):
            for root, dirs, files in os.walk(dist_dir):
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, dist_dir)
                    zf.write(full_path, arcname=f"web-app/{rel_path}")

        # 2. Add UPUTSTVO
        instructions = """===============================================================
KVOTA 2.0: TRI HEROJA, LUDILO 7+ & VARIJABILNI PROFIT
Kompletna aplikacija za vođenje sistema klađenja
===============================================================

KAKO DA PUSTITE SAJT ONLINE BESPLATNO ZA 10 SEKUNDI:
1. Otvorite sajt: https://app.netlify.com/drop
2. Prevucite folder "web-app" iz ove arhive direktno u prozor pretraživača.
3. Za 5 sekundi dobijate svoj lični, trajni link (npr. moja-kvota2.netlify.app)
   koji možete poslati bilo kome na Viber ili WhatsApp! Link radi 24/7 besplatno.

KAKO POKRENUTI LOKALNO NA RAČUNARU (Razvojni kod):
1. Instalirajte Node.js (https://nodejs.org)
2. Otvorite folder "source-code" u terminalu
3. Pokrenite:
   npm install
   npm run dev
4. Otvorite u pretraživaču: http://localhost:3000

FUNKCIJE APLIKACIJE:
- 3 odvojena režima klađenja (Ludilo 25+, Kvota 2.0, Varijabilni profit mašina)
- Sistem više korisničkih profila (svaki igrač ima svoj budžet i istoriju)
- Siguran reset modova pojedinačno ili celokupnog profila
- PWA podrška za instalaciju na ekran mobilnog telefona
===============================================================
"""
        zf.writestr("UPUTSTVO_ZA_KORISCENJE.txt", instructions)

        # 3. Add source code files
        source_dirs = ['src', 'public']
        source_files = ['package.json', 'tsconfig.json', 'vite.config.ts', 'index.html', 'metadata.json']
        
        for file in source_files:
            if os.path.exists(file):
                zf.write(file, arcname=f"source-code/{file}")
                
        for sdir in source_dirs:
            if os.path.exists(sdir):
                for root, dirs, files in os.walk(sdir):
                    for file in files:
                        if file.endswith('.zip'):
                            continue
                        full_path = os.path.join(root, file)
                        rel_path = os.path.relpath(full_path, '.')
                        zf.write(full_path, arcname=f"source-code/{rel_path}")

    print(f"Created {zip_path} (size: {os.path.getsize(zip_path)} bytes)")

if __name__ == '__main__':
    create_package()
