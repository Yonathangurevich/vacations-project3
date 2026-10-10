import { AuthMenu } from "../../user-area/auth-menu/auth-menu";
import { Copyrights } from "../copyrights/copyrights";
import { Header } from "../header/header";
import { Menu } from "../menu/menu";
import { Routing } from "../routing/routing";
import { useTokenExpiration } from "../../../hooks/use-token-expiration";
import "./layout.css";

export function Layout() {

    // one timer for the whole app - logs out the moment the token expires:
    useTokenExpiration(localStorage.getItem("token"));

    return (
        <div className="Layout">

			<header>
                <Header />
                <AuthMenu />
            </header>

            <nav>
                <Menu />
            </nav>

            <main>
                <Routing />
            </main>

            <footer>
                <Copyrights />
            </footer>

        </div>
    );
}
