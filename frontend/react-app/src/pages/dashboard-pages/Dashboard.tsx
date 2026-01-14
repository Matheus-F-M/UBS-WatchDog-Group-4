import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/stores/authStore";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.delete);

  /**
   * Handles user sign out action by using the logout function from the auth store.
   * @param e : Event
   */
  const handleSignOut = (e: Event) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  /**
   * Deletes user email and password from localStorage and redirects to login page.
   * @param e Event
   */
  const handleDeleteAccount = (e?: Event) => {
    // Called from the AlertDialog action (or as a fallback from an event)
    e?.preventDefault?.();

    deleteAccount();
    // After deleting account, send user to login page
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-UBS-black">
      {/* Top Navigation Bar */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
        style={{
          boxShadow: '0 2px 2px -1px #1c1b1b, 0 3px 3px -1px #b10606, 0 4px 4px -1px #971e99, 0 5px 5px -1px #0b0198'
        }}
      >
        <div className="flex items-center justify-between py-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-primary">
              UBS 
              <span className="bg-gradient-to-r from-[#b10606] via-[#971e99] to-[#0b0198] bg-clip-text text-transparent">
                BRAN
                </span>
            </h1>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/dashboard" className="px-2 py-1">Home</Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/dashboard/alerts" className="px-2 py-1">Alertas</Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/dashboard/clients" className="px-2 py-1">Clientes</Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/dashboard/transactions" className="px-2 py-1">Transações</Link>
                </NavigationMenuItem>


              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="User menu">👤</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem variant="destructive" className="flex items-center gap-2 text-UBS-red hover:text-UBS-red" onSelect={handleSignOut}>Sign out</DropdownMenuItem>
                <DropdownMenuSeparator />

  {/*Atenção especial para o AlertDialog de confirmação de deleção de conta!*/}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem variant="destructive" className="group flex items-center gap-2 text-UBS-red hover:text-UBS-red hover:ring-2 hover:ring-destructive hover:ring-offset-2 hover:ring-offset-white hover:rounded-sm"
                      onSelect={(e) => e.preventDefault()}
                      onClick={(e) => e.stopPropagation()}>
                      
                      <span className="transition-transform">Delete Account</span></DropdownMenuItem>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar Conta</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação removerá permanentemente suas credenciais do sistema. Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteAccount()}>Deletar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Page content (offset for fixed nav) */}
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
