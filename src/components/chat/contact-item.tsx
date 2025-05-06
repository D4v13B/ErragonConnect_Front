import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { UserChat } from "@/context/chat-context"
import { cn } from "@/lib/utils"

interface ContactItemProps {
  contact: Partial<UserChat>
  onSelect: () => void
  onClickDropdown: () => void
}

export function ContactItem({ contact, onSelect, onClickDropdown }: ContactItemProps) {

  return (
    <button
      className="flex w-full items-center rounded-lg p-2 text-left hover:bg-accent"
      onClick={onSelect}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={contact.avatar} alt={contact.nombre} />
          <AvatarFallback>{contact.nombre?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2",
            contact.botActivo ? "bg-green-500" : "bg-gray-400"
          )}
        />
      </div>
      <div className="ml-3 flex w-full justify-between items-center">
        <div>
          <p className="font-medium">{contact.nombre}</p>
          <p className="text-xs text-muted-foreground">
            {contact.botActivo ? "Bot Activo" : "Bot Inactivo"}
          </p>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={"16px"} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Opciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onClickDropdown}>{contact.tag == 1 ? 'Reabrir' : 'Resolver'}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </button>
  )
}
