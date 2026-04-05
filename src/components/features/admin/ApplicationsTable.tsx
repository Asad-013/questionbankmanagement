'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Mail, 
  MapPin, 
  GraduationCap,
  Phone
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { cn } from '@/lib/utils';

type Application = {
  id: string;
  full_name: string;
  address: string;
  whatsapp: string;
  university: string;
  department: string;
  session: string;
  id_card_url: string;
  status: 'pending' | 'approved' | 'rejected';
  email: string;
  created_at: string;
};

export function ApplicationsTable({ applications }: { applications: Application[] }) {
  const [pending, startTransition] = useTransition();

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    startTransition(async () => {
      const result = await updateApplicationStatus(id, status);
      if (result.success) {
        toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      } else {
        toast.error(result.error || 'Failed to update application');
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Applications ({applications.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No applications yet
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium">{app.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {app.department} • {app.session}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <a href={`mailto:${app.email}`} className="text-blue-500 hover:underline">
                      {app.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-500 hover:underline">
                      <Phone className="h-3 w-3" />
                      {app.whatsapp}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        {app.university}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      app.status === 'approved' ? 'default' :
                      app.status === 'rejected' ? 'destructive' : 'secondary'
                    } className={cn(
                      app.status === 'approved' && 'bg-green-500',
                      app.status === 'pending' && 'bg-yellow-500'
                    )}>
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(app.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={app.id_card_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          View ID
                        </a>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(app.id, 'approved')}
                            disabled={pending || app.status === 'approved'}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(app.id, 'rejected')}
                            disabled={pending || app.status === 'rejected'}
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
