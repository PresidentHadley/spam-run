'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Edit, Mail, Clock, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  subject_line: string
  email_body: string
  category: string
  tags: string[]
  last_used_at: string | null
  created_at: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    subject_line: '',
    email_body: '',
    category: '',
    tags: '',
  })
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Fetch templates
      const { data: templatesData, error } = await supabase
        .from('saved_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTemplates(templatesData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveTemplate() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const templateData = {
        user_id: user.id,
        name: formData.name,
        subject_line: formData.subject_line,
        email_body: formData.email_body,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      if (editingTemplate) {
        // Update existing
        const { error } = await supabase
          .from('saved_templates')
          .update(templateData)
          .eq('id', editingTemplate.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('saved_templates')
          .insert([templateData])

        if (error) throw error
      }

      setIsDialogOpen(false)
      setEditingTemplate(null)
      setFormData({ name: '', subject_line: '', email_body: '', category: '', tags: '' })
      fetchData()
    } catch (error) {
      console.error('Error saving template:', error)
      alert('Failed to save template')
    }
  }

  async function handleDeleteTemplate(id: string) {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await supabase
        .from('saved_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting template:', error)
      alert('Failed to delete template')
    }
  }

  async function handleUseTemplate(template: Template) {
    // Update last_used_at
    await supabase
      .from('saved_templates')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', template.id)

    // Redirect to checker with template data
    const params = new URLSearchParams({
      subject: template.subject_line,
      body: template.email_body,
    })
    router.push(`/dashboard/checker?${params}`)
  }

  function openEditDialog(template?: Template) {
    if (template) {
      setEditingTemplate(template)
      setFormData({
        name: template.name,
        subject_line: template.subject_line,
        email_body: template.email_body,
        category: template.category || '',
        tags: template.tags?.join(', ') || '',
      })
    } else {
      setEditingTemplate(null)
      setFormData({ name: '', subject_line: '', email_body: '', category: '', tags: '' })
    }
    setIsDialogOpen(true)
  }

  // Check if user has access to templates
  const hasAccess = profile && profile.plan_tier !== 'free'
  const templateLimit = profile?.plan_tier === 'enterprise' ? 999999 : profile?.plan_tier === 'pro' ? 50 : 25

  if (loading) {
    return <div>Loading...</div>
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Saved Templates</h1>
          <p className="text-muted-foreground mt-1">
            Save and reuse your best-performing email templates
          </p>
        </div>

        <Card className="border-2 border-dashed">
          <CardHeader className="text-center py-12">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Templates Available on Paid Plans</CardTitle>
            <CardDescription className="max-w-md mx-auto">
              Upgrade to Starter, Pro, or Enterprise to save and reuse your email templates. Save time and maintain consistency across your campaigns.
            </CardDescription>
            <div className="mt-6">
              <Button onClick={() => router.push('/pricing')}>
                View Pricing Plans
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Saved Templates</h1>
          <p className="text-muted-foreground mt-1">
            {templates.length} of {templateLimit} templates saved
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()} disabled={templates.length >= templateLimit}>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
              <DialogDescription>
                Save email templates for quick reuse and consistent messaging
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Cold Outreach Template"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  placeholder="e.g., Sales, Marketing, Follow-up"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (Optional, comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., cold-email, b2b, prospecting"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject line"
                  value={formData.subject_line}
                  onChange={(e) => setFormData({ ...formData, subject_line: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                  id="body"
                  placeholder="Enter email body"
                  rows={10}
                  value={formData.email_body}
                  onChange={(e) => setFormData({ ...formData, email_body: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTemplate} disabled={!formData.name || !formData.email_body}>
                {editingTemplate ? 'Update' : 'Save'} Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardHeader className="text-center py-12">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>No Templates Yet</CardTitle>
            <CardDescription>
              Create your first template to save time on repetitive emails
            </CardDescription>
            <div className="mt-6">
              <Button onClick={() => openEditDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Template
              </Button>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.category && (
                      <Badge variant="secondary" className="mt-2">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                    <p className="text-sm">{template.subject_line}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Body Preview:</p>
                    <p className="text-sm line-clamp-3">{template.email_body}</p>
                  </div>
                  {template.tags && template.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.last_used_at 
                          ? `Used ${new Date(template.last_used_at).toLocaleDateString()}`
                          : 'Never used'
                        }
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleUseTemplate(template)}>
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
